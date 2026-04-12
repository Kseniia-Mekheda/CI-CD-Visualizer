def generate_graph(yaml_data: dict) -> dict:
    jobs = yaml_data.get("jobs", {})
    if not jobs:
        raise ValueError("У поточній конфігурації не знайдено секції 'jobs'")
    
    nodes = []
    edges = []

    for job_id, job_data in jobs.items():
        nodes.append({
            "id": job_id,
            "position": {"x": 0, "y": 0},
            "data": {
                "label": job_id,
                "details": job_data
            },
            "type": "default"
        })

        needs = job_data.get("needs", [])

        if isinstance(needs, str):
            needs = [needs]
        
        for dependency in needs:
            edges.append({
                "id": f"e-{dependency}-{job_id}",
                "source": dependency,
                "target": job_id,
                "type": "smoothstep",
                "animated": True,
            })
        
    return {
        "nodes": nodes,
        "edges": edges
    }