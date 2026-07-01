import json

log_path = r"C:\Users\ADMIN\.gemini\antigravity\brain\492ae67b-20d3-46da-9f92-7c0a612279f3\.system_generated\logs\overview.txt"

with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        if 'git ' in line.lower():
            try:
                data = json.loads(line)
                for tc in data.get('tool_calls', []):
                    if tc.get('name') == 'run_command':
                        args = tc.get('args', {})
                        print(f"Step {data.get('step_index')}: {args.get('CommandLine')}")
            except Exception as e:
                pass
