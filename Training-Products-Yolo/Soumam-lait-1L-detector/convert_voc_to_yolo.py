import os
import xml.etree.ElementTree as ET

# Paths
input_dir = "dataset/images/val"
output_dir = "dataset/labels/val"

classes = ["soummam_milk"]

os.makedirs(output_dir, exist_ok=True)

def convert_bbox(size, box):
    dw = 1. / size[0]
    dh = 1. / size[1]
    x = (box[0] + box[1]) / 2.0 - 1
    y = (box[2] + box[3]) / 2.0 - 1
    w = box[1] - box[0]
    h = box[3] - box[2]
    x = x * dw
    w = w * dw
    y = y * dh
    h = h * dh
    return (x, y, w, h)

for file in os.listdir(input_dir):
    if not file.endswith(".xml"):
        continue
    in_file = open(os.path.join(input_dir, file))
    tree = ET.parse(in_file)
    root = tree.getroot()

    size = root.find("size")
    w = int(size.find("width").text)
    h = int(size.find("height").text)

    out_file = open(os.path.join(output_dir, file.replace(".xml", ".txt")), "w")

    for obj in root.iter("object"):
        cls = obj.find("name").text
        if cls not in classes:
            continue
        cls_id = classes.index(cls)
        xmlbox = obj.find("bndbox")
        b = (float(xmlbox.find("xmin").text), float(xmlbox.find("xmax").text),
             float(xmlbox.find("ymin").text), float(xmlbox.find("ymax").text))
        bb = convert_bbox((w, h), b)
        out_file.write(f"{cls_id} {' '.join([str(a) for a in bb])}\n")

    in_file.close()
    out_file.close()

print(f"✅ Conversion complete! Files saved in: {output_dir}")