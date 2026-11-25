"""
Regra da Farvalle: nunca cortar a cabeça das pessoas nas fotos.
Lê o JSON de scripts/check-heads-collect.mjs, detecta rostos (YuNet/OpenCV) em cada foto de public/
e avisa quando o topo da cabeça (topo do rosto - 18% da altura do rosto; cabelo curto não gera falso alarme) ou o queixo ficam fora
do pedaço visível da foto em alguma página/largura.

Uso: python3 scripts/check-heads.py /tmp/visiveis.json caminho/face_detection_yunet_2023mar.onnx
Sai com código 1 se encontrar corte.
"""
import json, sys, os
import cv2

data = json.load(open(sys.argv[1]))
model = sys.argv[2]
ROOT = os.path.join(os.path.dirname(__file__), "..", "public")
cache = {}
sizes = {}

def faces(src):
    if src in cache: return cache[src]
    path = os.path.normpath(os.path.join(ROOT, src.lstrip("/")))
    img = cv2.imread(path)
    if img is None: cache[src] = None; return None
    h, w = img.shape[:2]
    sizes[src] = (w, h)
    s = min(1.0, 1600 / max(w, h))
    small = cv2.resize(img, (int(w * s), int(h * s)))
    det = cv2.FaceDetectorYN.create(model, "", (small.shape[1], small.shape[0]), 0.75)
    _, found = det.detect(small)
    res = []
    if found is not None:
        for f in found:
            x, y, fw, fh = (float(v) / s for v in f[:4])
            if fh < h * 0.04: continue  # rostos muito pequenos (multidão ao fundo) não contam
            res.append((x, y, fw, fh))
    cache[src] = res
    return res

problems = []
for it in data:
    r = it.get("rect")
    if not r or it["src"].endswith(".svg"): continue
    fs = faces(it["src"])
    if not fs: continue
    W, H = sizes[it["src"]]
    r = {"x": r["x"] * W, "y": r["y"] * H, "w": r["w"] * W, "h": r["h"] * H}
    for (x, y, fw, fh) in fs:
        cx = x + fw / 2
        if not (r["x"] <= cx <= r["x"] + r["w"]): continue  # rosto fora da área visível na horizontal
        head_top = y - 0.18 * fh
        cut_top = head_top < r["y"] - 0.04 * fh and y + fh > r["y"]
        cut_chin = y + fh > r["y"] + r["h"] + 0.08 * fh and y < r["y"] + r["h"]
        if cut_top or cut_chin:
            problems.append((it["page"], it["width"], it["src"], "cabeça cortada no alto" if cut_top else "queixo cortado"))

seen = set()
for p in problems:
    if p in seen: continue
    seen.add(p)
    print("%s @%spx  %s  -> %s" % p)
print(f"{len(seen)} ocorrência(s) em {len({p[2] for p in seen})} foto(s)")
sys.exit(1 if seen else 0)
