// Original October 22, 2026 Next Byte build. Deterministic fixtures, not anonymization.
export const VERSION = 'fixtureforge-1';
const TYPES = new Set(['sequence','integer','decimal','category']);
export function validate(input) {
  if (!input || typeof input !== 'object') throw Error('Provide a fixture recipe.');
  if (!Number.isInteger(input.rows) || input.rows < 1 || input.rows > 10000) throw Error('Rows must be an integer from 1 to 10,000.');
  if (typeof input.seed !== 'string' || !input.seed.trim() || input.seed.length > 100) throw Error('Seed must contain 1–100 characters.');
  if (!Array.isArray(input.columns) || input.columns.length < 1 || input.columns.length > 12) throw Error('Use 1–12 columns.');
  const names = new Set();
  const columns = input.columns.map((c,i) => {
    const label = `Column ${i+1}`;
    if (!c || !/^[A-Za-z_][A-Za-z0-9_]{0,39}$/.test(c.name)) throw Error(`${label}: use a name starting with a letter or underscore, up to 40 characters.`);
    if (names.has(c.name.toLowerCase())) throw Error(`${label}: names must be unique (ignoring case).`);
    names.add(c.name.toLowerCase());
    if (!TYPES.has(c.type)) throw Error(`${label}: unsupported type.`);
    if (!Number.isInteger(c.nullPercent) || c.nullPercent < 0 || c.nullPercent > 100) throw Error(`${label}: missing percentage must be an integer from 0 to 100.`);
    const out={name:c.name,type:c.type,nullPercent:c.nullPercent};
    if (c.type === 'category') {
      if (!Array.isArray(c.choices) || c.choices.length < 1 || c.choices.length > 30 || c.choices.some(x => typeof x !== 'string' || !x.trim() || x.length>80)) throw Error(`${label}: use 1–30 nonempty choices, at most 80 characters each.`);
      out.choices=[...new Set(c.choices)];
    } else {
      if (typeof c.min !== 'number' || !Number.isFinite(c.min) || Math.abs(c.min)>1e9) throw Error(`${label}: minimum must be a number between -1 billion and 1 billion.`);
      out.min=c.min;
      if (c.type==='sequence') {
        if (!Number.isInteger(c.min) || Math.abs(c.min+input.rows-1)>1e9) throw Error(`${label}: sequence start and end must be integers within ±1 billion.`);
      } else {
        if (typeof c.max !== 'number' || !Number.isFinite(c.max) || Math.abs(c.max)>1e9 || c.max<c.min) throw Error(`${label}: maximum must be a number at least as large as minimum, within ±1 billion.`);
        if (c.type==='integer' && (!Number.isInteger(c.min)||!Number.isInteger(c.max))) throw Error(`${label}: integer bounds must be whole numbers.`);
        if (c.type==='decimal' && (Math.abs(c.min*100-Math.round(c.min*100))>0.00001 || Math.abs(c.max*100-Math.round(c.max*100))>0.00001)) throw Error(`${label}: decimal bounds support at most two decimal places.`);
        out.max=c.max;
      }
    }
    return out;
  });
  return {version:VERSION,rows:input.rows,seed:input.seed,columns};
}
function random(seed) {
  let state=2166136261;
  for (const char of seed) { state^=char.codePointAt(0);state=Math.imul(state,16777619)>>>0; }
  if (!state) state=0x9e3779b9;
  return () => { state^=state<<13;state^=state>>>17;state^=state<<5; return (state>>>0)/4294967296; };
}
export function generate(input) {
  const recipe=validate(input), rng=random(recipe.seed);
  const records=Array.from({length:recipe.rows},(_,i)=>recipe.columns.map(c=>{
    if (rng()*100<c.nullPercent) return null;
    if(c.type==='sequence') return c.min+i;
    if(c.type==='category') return c.choices[Math.floor(rng()*c.choices.length)];
    const scale=c.type==='decimal'?100:1;
    const min=Math.round(c.min*scale),max=Math.round(c.max*scale);
    return (min+Math.floor(rng()*(max-min+1)))/scale;
  }));
  return {recipe,records};
}
function csvCell(value) {
  if(value===null) return '';
  let text=String(value);
  // Neutralize common spreadsheet formula prefixes in category text only.
  if(typeof value==='string' && /^[\s]*[=+\-@]/.test(text)) text="'"+text;
  return /[",\r\n]/.test(text)?'"'+text.replaceAll('"','""')+'"':text;
}
export function csv(result) {
  return [result.recipe.columns.map(c=>csvCell(c.name)).join(','),...result.records.map(row=>row.map(csvCell).join(','))].join('\r\n')+'\r\n';
}
export function recipeJSON(result) { return JSON.stringify(result.recipe,null,2)+'\n'; }
export function demoRecipe() { return {rows:40,seed:'next-byte-2026',columns:[
  {name:'order_id',type:'sequence',min:1001,nullPercent:0},
  {name:'region',type:'category',choices:['North','South','East','West'],nullPercent:0},
  {name:'items',type:'integer',min:1,max:12,nullPercent:0},
  {name:'amount',type:'decimal',min:10,max:200,nullPercent:10}
]}; }
