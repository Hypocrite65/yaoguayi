/**
 * build-data.js — 卦象数据构建脚本
 *
 * 设计说明：
 * 将 packages/iching-data 中的 64 个独立 JSON 文件合并为一个
 * apps/site/data/hexagrams.json，供前端页面 fetch 加载。
 * 按卦序(id)排序，剔除 aiSummary 等前端不需要的字段。
 */

const fs = require('fs');
const path = require('path');

// 源数据目录
const SRC_DIR = path.join(__dirname, '..', 'packages', 'iching-data', 'src', 'hexagrams');
// 译文目录
const TRANS_DIR = path.join(__dirname, '..', 'packages', 'iching-data', 'src', 'translations');
// 输出文件
const OUT_FILE = path.join(__dirname, '..', 'apps', 'site', 'data', 'hexagrams.json');

// 确保输出目录存在
const outDir = path.dirname(OUT_FILE);
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 读取所有 JSON 文件
const files = fs.readdirSync(SRC_DIR)
  .filter(f => f.endsWith('.json'))
  .sort();

console.log(`Found ${files.length} hexagram JSON files`);

const hexagrams = [];

for (const file of files) {
  const filePath = path.join(SRC_DIR, file);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data = JSON.parse(raw);

  // 尝试加载对应的译文文件
  const transFile = path.join(TRANS_DIR, String(data.id).padStart(3, '0') + '.json');
  let trans = null;
  if (fs.existsSync(transFile)) {
    trans = JSON.parse(fs.readFileSync(transFile, 'utf-8'));
  }

  // 合并原文和译文，保留前端需要的字段
  const entry = {
    id: data.id,
    name: data.name,
    pinyin: data.pinyin,
    symbol: data.symbol,
    lines: data.lines,
    upperTrigram: data.upperTrigram,
    lowerTrigram: data.lowerTrigram,
    guaci: data.guaci,
    tuan: data.tuan,
    xiang: data.xiang,
    yaoci: data.yaoci
  };

  // 添加译文字段（如果存在）
  if (trans) {
    entry.guaci_trans = trans.guaci_trans;
    entry.tuan_trans = trans.tuan_trans;
    entry.xiang_trans = trans.xiang_trans;
    if (trans.yaoci_trans && entry.yaoci) {
      // 将爻辞译文合并到原始爻辞数组中
      for (const yt of trans.yaoci_trans) {
        const yao = entry.yaoci.find(y => y.position === yt.position);
        if (yao) {
          yao.text_trans = yt.text_trans;
          yao.xiang_trans = yt.xiang_trans;
        }
      }
    }
  }

  hexagrams.push(entry);
}

// 按 id 排序
hexagrams.sort((a, b) => a.id - b.id);

// 写入输出文件（紧凑格式，减小体积）
fs.writeFileSync(OUT_FILE, JSON.stringify(hexagrams), 'utf-8');

const sizeKB = (fs.statSync(OUT_FILE).size / 1024).toFixed(1);
console.log(`Generated ${OUT_FILE}`);
console.log(`Total: ${hexagrams.length} hexagrams, ${sizeKB} KB`);
