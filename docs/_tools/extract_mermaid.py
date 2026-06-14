"""Extract ```mermaid blocks from a markdown file into numbered .mmd files."""
import os
import sys

md_path, doc_key, out_dir = sys.argv[1], sys.argv[2], sys.argv[3]
os.makedirs(out_dir, exist_ok=True)

with open(md_path, 'r', encoding='utf-8') as f:
    lines = f.read().replace('\r\n', '\n').split('\n')

count = 0
i = 0
while i < len(lines):
    if lines[i].strip().lower().startswith('```mermaid'):
        block = []
        i += 1
        while i < len(lines) and not lines[i].strip().startswith('```'):
            block.append(lines[i])
            i += 1
        count += 1
        out = os.path.join(out_dir, f'{doc_key}_{count}.mmd')
        with open(out, 'w', encoding='utf-8') as o:
            o.write('\n'.join(block).strip() + '\n')
        print(out)
    i += 1

print(f'TOTAL {doc_key} {count}')
