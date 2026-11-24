// Shared LifeFlow habit schedule, backward compatible with version 1 records.
window.LifeHabits=(()=>{
const defaults=[
 {name:'Health & fitness',color:'#d1ff75',tasks:[['wake','Wake up on time'],['walk','Complete walking or workout goal'],['water','Drink enough water'],['food','Eat healthy meals'],['sleep','Meet my sleep goal']]},
 {name:'Editing & career',color:'#ae9aff',tasks:[['ae','Practice After Effects'],['project','Work on editing projects']]},
 {name:'Content creation',color:'#75d9ec',tasks:[['teach','Work on educational content'],['portfolio','Work on portfolio or creative content'],['outreach','Contact or follow up with clients']]},
 {name:'Financial discipline',color:'#ffc58a',tasks:[['money','Record income and expenses']]},
 {name:'Personal development',color:'#f0a1cf',tasks:[['study','Complete study or college work'],['screen','Stick to my screen-time goal'],['plan','Plan tomorrow’s priorities']]}
];
const copy=x=>JSON.parse(JSON.stringify(x));
const validDate=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&d>='1900-01-01'&&!Number.isNaN(Date.parse(d))&&new Date(d+'T00:00:00Z').toISOString().slice(0,10)===d;
function groups(schedule,day){const dates=Object.keys(schedule||{}).filter(d=>d<=day).sort();return dates.length?schedule[dates.at(-1)]:defaults}
function total(schedule,day){return groups(schedule,day).reduce((n,g)=>n+g.tasks.length,0)}
function validate(v){if(!v||v.version!==1||!v.records||typeof v.records!=='object'||Array.isArray(v.records))throw Error('Invalid LifeFlow records');const schedule={};const raw=v.schedule??{};if(typeof raw!=='object'||Array.isArray(raw))throw Error('Invalid habit schedule');for(const [d,gs] of Object.entries(raw)){if(!validDate(d)||!Array.isArray(gs)||gs.length!==defaults.length)throw Error('Invalid habit schedule date');const ids=new Set();schedule[d]=defaults.map((g,i)=>{const list=gs[i]?.tasks;if(!Array.isArray(list))throw Error('Invalid habit group');return {...g,tasks:list.map(t=>{if(!Array.isArray(t)||t.length!==2||typeof t[0]!=='string'||!/^[a-zA-Z0-9_-]{1,90}$/.test(t[0])||ids.has(t[0])||typeof t[1]!=='string'||!t[1].trim()||t[1].length>100)throw Error('Invalid custom habit');ids.add(t[0]);return [t[0],t[1].trim()]})}});if(!ids.size||ids.size>100)throw Error('Choose 1–100 habits')}
const records={};for(const [d,a] of Object.entries(v.records)){if(!validDate(d)||!Array.isArray(a))throw Error('Invalid record date');const ids=new Set(groups(schedule,d).flatMap(g=>g.tasks.map(t=>t[0])));if(a.some(id=>!ids.has(id)))throw Error('Completed habit does not match its historical checklist');if(a.length)records[d]=[...new Set(a)].sort()}return {version:1,records,...(Object.keys(schedule).length?{schedule}:{})}}
function merge(a,b){a=validate(a);b=validate(b);const schedule={...b.schedule,...a.schedule};const records={...a.records};for(const [d,v] of Object.entries(b.records))records[d]=[...new Set([...(records[d]||[]),...v])];return validate({version:1,records,schedule})}
return {defaults,copy,groups,total,validate,merge};})();
