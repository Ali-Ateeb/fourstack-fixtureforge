import {generate,csv,recipeJSON,demoRecipe} from './core.js';
const $=id=>document.getElementById(id);let result=null;
const text=(tag,value)=>{const e=document.createElement(tag);e.textContent=value;return e;};
function invalidate(){result=null;$('output').hidden=true;$('message').textContent='Recipe changed. Generate again before exporting.';$('message').className='';}
function input(label,value,type='text'){const l=text('label',label),e=document.createElement('input');e.type=type;e.value=value;l.append(e);return [l,e];}
function column(c={name:'field_'+($('columns').children.length+1),type:'integer',min:0,max:100,nullPercent:0}){
 const row=document.createElement('div');row.className='column';
 const [nameLabel,name]=input('Column name',c.name);name.maxLength=40;row.append(nameLabel);
 const tl=text('label','Type'),type=document.createElement('select');for(const [v,t] of [['sequence','Sequence'],['integer','Integer'],['decimal','Decimal (2 places)'],['category','Category']]){const o=text('option',t);o.value=v;type.append(o);}type.value=c.type;tl.append(type);row.append(tl);
 const values=document.createElement('div');values.className='values';row.append(values);
 function bounds(){values.replaceChildren();if(type.value==='category'){const [l,e]=input('Choices (separate with |)',c.choices?.join(' | ')??'Alpha | Beta | Gamma');e.dataset.field='choices';values.append(l);}else{values.classList.add('range');const [l,e]=input(type.value==='sequence'?'Starts at':'Minimum',c.min??0,'number');e.step=type.value==='decimal'?'0.01':'1';e.dataset.field='min';values.append(l);if(type.value!=='sequence'){const [l2,e2]=input('Maximum',c.max??100,'number');e2.step=e.step;e2.dataset.field='max';values.append(l2);}}}
 type.addEventListener('change',()=>{values.classList.remove('range');bounds();invalidate();});bounds();
 const [missingLabel,missing]=input('Missing %',c.nullPercent,'number');missing.min=0;missing.max=100;missing.step=1;row.append(missingLabel);
 const remove=text('button','×');remove.type='button';remove.className='remove';remove.setAttribute('aria-label','Remove '+c.name);remove.addEventListener('click',()=>{row.remove();invalidate();$('add').disabled=false;});row.append(remove);
 row.read=()=>({name:name.value,type:type.value,nullPercent:missing.value===''?NaN:Number(missing.value),...(type.value==='category'?{choices:values.querySelector('input').value.split('|').map(v=>v.trim())}:{min:values.querySelector('[data-field=min]').value===''?NaN:Number(values.querySelector('[data-field=min]').value),...(type.value==='sequence'?{}:{max:values.querySelector('[data-field=max]').value===''?NaN:Number(values.querySelector('[data-field=max]').value)})})});
 $('columns').append(row);$('add').disabled=$('columns').children.length>=12;
}
function load(){const p=demoRecipe();$('rows').value=p.rows;$('seed').value=p.seed;$('columns').replaceChildren();p.columns.forEach(column);invalidate();$('message').textContent='Invented orders loaded. Generate the fixture to see the result.';}
function download(data,name,mime){if(!result)return;const url=URL.createObjectURL(new Blob([data],{type:mime}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('recipe').addEventListener('input',invalidate);$('recipe').addEventListener('change',invalidate);
$('example').addEventListener('click',load);$('add').addEventListener('click',()=>{column();invalidate();});
$('recipe').addEventListener('submit',e=>{e.preventDefault();try{const recipe={rows:Number($('rows').value),seed:$('seed').value,columns:[...$('columns').children].map(row=>row.read())};const next=generate(recipe);result=next;
 $('thead').replaceChildren();const hr=document.createElement('tr');next.recipe.columns.forEach(c=>hr.append(text('th',c.name)));$('thead').append(hr);$('tbody').replaceChildren();next.records.slice(0,10).forEach(row=>{const tr=document.createElement('tr');row.forEach(v=>{const td=text('td',v===null?'—':String(v));if(v===null)td.className='null';tr.append(td);});$('tbody').append(tr);});
 $('summary').textContent=`${next.records.length.toLocaleString()} rows / ${next.recipe.columns.length} columns`;
 const missing=next.records.reduce((n,row)=>n+row.filter(v=>v===null).length,0);$('stats').textContent=`${missing} missing cells sampled. Seed: ${next.recipe.seed}. Changing the recipe or column order changes the fixture.`;
 $('message').className='';$('message').textContent='Fixture generated locally. The same version, seed and recipe reproduce the same values.';$('output').hidden=false;
 }catch(error){result=null;$('output').hidden=true;$('message').className='error';$('message').textContent=error.message;}});
$('csv').addEventListener('click',()=>result&&download(csv(result),'fixtureforge-synthetic.csv','text/csv;charset=utf-8'));
$('json').addEventListener('click',()=>result&&download(recipeJSON(result),'fixtureforge-recipe.json','application/json'));
load();
