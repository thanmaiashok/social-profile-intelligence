from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.models.request_model import SearchRequest
from app.models.response_model import SearchResponse
from app.services.username_variants import generate_variants
from app.services.platform_checker import check_platforms_async
from app.services.result_aggregator import aggregate
from app.services.gender_inference import infer_gender
import json
import asyncio

router = APIRouter()

# Wrapper for synchronous route if needed, using async checker internally
@router.post("/search", response_model=SearchResponse)
async def search(req: SearchRequest):
    results = []
    gender = infer_gender(req.username)
    variants = generate_variants(req.username)
    
    # Fully Parallel Execution
    tasks = [check_platforms_async(v) for v in variants]
    all_results = await asyncio.gather(*tasks)
    
    # Flatten list
    for r in all_results:
        results.extend(r)
        
    return {
        "results": aggregate(results),
        "gender": gender
    }

from app.services.profiler import generate_profile

@router.websocket("/ws/search")
async def websocket_search(websocket: WebSocket):
    await websocket.accept()
    try:
        data = await websocket.receive_text()
        req = json.loads(data)
        username = req.get("username")
        
        if not username:
             await websocket.send_json({"type": "error", "message": "Username required"})
             return

        # 1. Gender Inference
        await websocket.send_json({"type": "update", "progress": 10, "status": "Analyzing demographics..."})
        gender = infer_gender(username)
        # await asyncio.sleep(0.5) # Removed sleep for speed

        # 2. Variant Generation
        await websocket.send_json({"type": "update", "progress": 20, "status": "Generating ID variants..."})
        variants = generate_variants(username)
        
        # 3. Platform Checks (FULL PARALLEL MODE)
        await websocket.send_json({"type": "update", "progress": 40, "status": "Scanning Global Networks..."})
        
        # Create all tasks at once
        tasks = [check_platforms_async(v) for v in variants]
        
        # Wait for all of them to complete simultaneously
        # speed = max(slowest_request) instead of sum(all_requests)
        all_results = await asyncio.gather(*tasks)
        
        # Flatten results
        results = []
        for r in all_results:
            results.extend(r)
            
        # 4. Aggregation
        await websocket.send_json({"type": "update", "progress": 90, "status": "Aggregating intelligence..."})
        final_results = aggregate(results)

        # 5. AI Profiling (Active)
        await websocket.send_json({"type": "update", "progress": 95, "status": "Compiling psychological profile..."})
        try:
            ai_profile = generate_profile(username, final_results)
        except Exception as e:
            print(f"AI Profiling Error: {e}")
            ai_profile =  {
                "score": 0,
                "summary": "AI Analysis unavailable due to high traffic.",
                "origin_theory": "Unknown",
                "threat_vector": "Unknown"
            }

        await websocket.send_json({
            "type": "result", 
            "progress": 100, 
            "status": "Complete",
            "data": {
                "results": final_results,
                "gender": gender,
                "ai_profile": ai_profile
            }
        })
        
    except WebSocketDisconnect:
        print("Client disconnected")
