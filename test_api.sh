#!/bin/bash

# Script de prueba para el API de procesamiento de imágenes
# Asegúrate de tener una imagen subida primero

echo "=== Biological Image Processing API Test ==="
echo ""

# Colores para output
GREEN='\033[0.32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# URL base
BASE_URL="http://localhost:5000/api"

# 1. Verificar health
echo -e "${BLUE}1. Verificando estado del servidor...${NC}"
curl -s ${BASE_URL}/../health | jq
echo ""

# 2. Subir una imagen de prueba
echo -e "${BLUE}2. Subiendo imagen TIFF de prueba...${NC}"
UPLOAD_RESPONSE=$(curl -s -F "images=@test_images/cell_001.tif" ${BASE_URL}/upload/images)
echo $UPLOAD_RESPONSE | jq
IMAGE_ID=$(echo $UPLOAD_RESPONSE | jq -r '.images[0].id')
echo -e "${GREEN}Image ID: $IMAGE_ID${NC}"
echo ""

# Esperar un momento para que se procese
sleep 2

# 3. Probar modo Fluorescent con Blue (DAPI)
echo -e "${BLUE}3. Probando modo FLUORESCENT (Blue - DAPI)...${NC}"
curl -s -X POST ${BASE_URL}/image/process \
  -H "Content-Type: application/json" \
  -d "{
    \"imageId\": \"$IMAGE_ID\",
    \"contrast\": 1.5,
    \"brightness\": 20,
    \"colormap_type\": \"fluorescent\",
    \"colorId\": 1
  }" | jq -r '.status, .applied_colormap, .processing_time_ms'
echo ""

# 4. Probar modo H&E
echo -e "${BLUE}4. Probando modo H&E (Histología)...${NC}"
curl -s -X POST ${BASE_URL}/image/process \
  -H "Content-Type: application/json" \
  -d "{
    \"imageId\": \"$IMAGE_ID\",
    \"contrast\": 1.2,
    \"brightness\": 10,
    \"colormap_type\": \"he\"
  }" | jq -r '.status, .applied_colormap, .processing_time_ms'
echo ""

# 5. Probar modo Segment
echo -e "${BLUE}5. Probando modo SEGMENT (Segmentación)...${NC}"
curl -s -X POST ${BASE_URL}/image/process \
  -H "Content-Type: application/json" \
  -d "{
    \"imageId\": \"$IMAGE_ID\",
    \"contrast\": 1.0,
    \"brightness\": 0,
    \"colormap_type\": \"segment\"
  }" | jq -r '.status, .applied_colormap, .processing_time_ms'
echo ""

# 6. Probar modo Region
echo -e "${BLUE}6. Probando modo REGION (Tumor vs Stroma)...${NC}"
curl -s -X POST ${BASE_URL}/image/process \
  -H "Content-Type: application/json" \
  -d "{
    \"imageId\": \"$IMAGE_ID\",
    \"contrast\": 1.0,
    \"brightness\": 0,
    \"colormap_type\": \"region\"
  }" | jq -r '.status, .applied_colormap, .processing_time_ms'
echo ""

# 7. Obtener histograma
echo -e "${BLUE}7. Generando histograma...${NC}"
curl -s ${BASE_URL}/image/$IMAGE_ID/histogram | jq '.totalPixels, .width, .height'
echo ""

echo -e "${GREEN}=== Pruebas completadas ===${NC}"
echo ""
echo "Para ver las imágenes procesadas en base64, guarda la respuesta en un archivo:"
echo "curl -X POST ${BASE_URL}/image/process -H \"Content-Type: application/json\" -d '{...}' > response.json"
echo "Luego puedes extraer el base64 y usarlo en HTML:"
echo "<img src=\"data:image/png;base64,...\" />"




