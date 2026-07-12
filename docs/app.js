const dimensions=[['math','数学思维','陌生题、推理与建模'],['science','科学探究','实验、观察与跨学科'],['language','语文英语','阅读、表达与信息提取'],['expression','面试表达','观点、倾听与临场反应'],['endurance','学习耐力','长期训练与复盘能力']];
const scores={math:4,science:4,language:3,expression:3,endurance:4};
const routes={
  huchuang:{name:'湖创创新班路径',tag:'数理探究型',fit:'数学、科学优势明显，喜欢研究开放问题，能适应较快节奏。',prep:['数学思维与综合科学双主线','每周一次限时综合卷','实验探究题写完整过程'],points:['数理好奇心与探究耐力','通勤、住宿与竞赛投入','每年规则可能调整，准备要保留 B 计划']},
  qizheng:{name:'杭高启正路径',tag:'均衡发展型',fit:'学科基础均衡，学习习惯稳定，希望兼顾校内表现与长期发展。',prep:['校内基础保持高正确率','语数英科滚动复习','建立错因标签与周复盘'],points:['均衡成绩与自主学习习惯','校内节奏与长期规划','每年规则可能调整，准备要保留 B 计划']},
  wenyuan:{name:'学军文渊自招 / 省招',tag:'拔尖挑战型',fit:'数理潜力突出、表达清楚，愿意接受高强度笔试和综合面试准备。',prep:['数学科学拔高与限时训练','材料阅读和观点表达','每两周一次全真面试'],points:['拔尖潜力与高压下的稳定性','招生范围、费用与高强度训练意愿','每年规则可能调整，准备要保留 B 计划']}
};
const written=[['数学：从“会做”到“讲清”','整式与方程、数论初步、几何推理、组合思维；每题写关键突破口，训练陌生题的启动能力。'],['科学：重视模型与实验','物理情境、化学现象、生物与地学材料；练变量控制、证据解释和实验改进。'],['语文英语：快速提取信息','长文本阅读、概括论证、英语科普材料；先搭结构，再完成精确表达。'],['全真模拟：速度与取舍','每两周一次跨学科限时训练，记录启动慢、计算错、卡题久三类失分。']];
const interview=[['90 秒自我介绍','用“我是谁—我钻研过什么—我如何解决问题—为什么选择这里”形成真实、有证据的表达。'],['学科追问','准备一个真正喜欢的数学或科学问题，能解释思路、失败尝试与下一步探索。'],['开放问题','采用“观点—理由—例子—边界”的四步结构；不知道时先澄清，不编造答案。'],['临场与礼仪','听完再答、眼神自然、允许停顿；训练被追问、被否定后继续完善观点。']];
const tasks=['完成一套数学限时训练并标记错因','精读一篇长材料，口头复述三分钟','完成一次科学探究题全过程书写','录制一次90秒自我介绍并回看','和家长完成一次本周复盘'];
function bestRoute(){const v={huchuang:scores.math*1.35+scores.science*1.45+scores.endurance*.8+scores.language*.3,qizheng:scores.math+scores.science+scores.language+scores.endurance+scores.expression*.45,wenyuan:scores.math*1.45+scores.science*1.2+scores.expression+scores.endurance*.9+scores.language*.55};return Object.keys(v).sort((a,b)=>v[b]-v[a])[0]}
function renderResult(){const r=routes[bestRoute()];document.querySelector('#result-tag').textContent=r.tag;document.querySelector('#result-title').textContent=r.name;document.querySelector('#result-fit').textContent=r.fit;document.querySelector('#result-list').innerHTML=r.prep.map(x=>`<li>${x}</li>`).join('')}
function renderScores(){document.querySelector('#score-fields').innerHTML=dimensions.map(([key,label,hint])=>`<div class="score-field"><div><strong>${label}</strong><small>${hint}</small></div><div class="score-buttons" data-key="${key}">${[1,2,3,4,5].map(n=>`<button class="${scores[key]===n?'selected':''}" aria-label="${label}${n}分">${n}</button>`).join('')}</div></div>`).join('');document.querySelectorAll('.score-buttons button').forEach(b=>b.addEventListener('click',()=>{const key=b.parentElement.dataset.key;scores[key]=Number(b.textContent);renderScores();renderResult()}))}
function showRoute(key){const r=routes[key];document.querySelector('#route-tag').textContent=r.tag;document.querySelector('#route-title').textContent=r.name;document.querySelector('#route-fit').textContent=r.fit;document.querySelector('#route-points').innerHTML=['重点观察','家庭要确认','不要忽略'].map((x,i)=>`<div><small>${x}</small><strong>${r.points[i]}</strong></div>`).join('');document.querySelectorAll('[data-route]').forEach(b=>b.classList.toggle('active',b.dataset.route===key))}
function showPrep(type){const rows=type==='written'?written:interview;document.querySelector('#prep-content').innerHTML=rows.map((x,i)=>`<div class="prep-card ${i===0?'featured':''}"><span>0${i+1}</span><div><h3>${x[0]}</h3><p>${x[1]}</p></div></div>`).join('');document.querySelectorAll('[data-prep]').forEach(b=>b.classList.toggle('active',b.dataset.prep===type))}
function renderTasks(){document.querySelector('#checklist').innerHTML=tasks.map((t,i)=>`<label><input type="checkbox"><span class="fake-check">${i+1}</span><span>${t}</span></label>`).join('');document.querySelectorAll('#checklist input').forEach(input=>input.addEventListener('change',()=>{const label=input.closest('label');label.classList.toggle('checked',input.checked);label.querySelector('.fake-check').textContent=input.checked?'✓':[...document.querySelectorAll('#checklist input')].indexOf(input)+1;const n=document.querySelectorAll('#checklist input:checked').length;document.querySelector('#progress-bar').style.width=`${n*20}%`;document.querySelector('#progress-text').textContent=`${n} / 5 已完成`}))}

const PLAN_STORAGE_KEY='jy-daily-plans-v1';
let dailyPlans=[];
function localDateString(date=new Date()){const offset=date.getTimezoneOffset()*60000;return new Date(date.getTime()-offset).toISOString().slice(0,10)}
function escapeHtml(value=''){return String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]))}
function loadDailyPlans(){try{const saved=JSON.parse(localStorage.getItem(PLAN_STORAGE_KEY)||'[]');dailyPlans=Array.isArray(saved)?saved:[]}catch{dailyPlans=[]}}
function saveDailyPlans(){localStorage.setItem(PLAN_STORAGE_KEY,JSON.stringify(dailyPlans))}
function minutesBetween(start,end){if(!start||!end)return 0;const [sh,sm]=start.split(':').map(Number);const [eh,em]=end.split(':').map(Number);let minutes=(eh*60+em)-(sh*60+sm);if(minutes<0)minutes+=1440;return minutes}
function defaultTimes(){const now=new Date();now.setMinutes(Math.ceil(now.getMinutes()/5)*5,0,0);const end=new Date(now.getTime()+30*60000);return{start:`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`,end:`${String(end.getHours()).padStart(2,'0')}:${String(end.getMinutes()).padStart(2,'0')}`}}
function selectedPlanDate(){return document.querySelector('#plan-date').value||localDateString()}
function renderDailyPlans(){
  const date=selectedPlanDate();
  const plans=dailyPlans.filter(plan=>plan.date===date).sort((a,b)=>(a.start||'99:99').localeCompare(b.start||'99:99'));
  const doneCount=plans.filter(plan=>plan.done).length;
  const totalMinutes=plans.reduce((sum,plan)=>sum+Number(plan.minutes||0),0);
  document.querySelector('#plan-count').textContent=`${plans.length} 项`;
  document.querySelector('#plan-total-minutes').textContent=`${totalMinutes} 分钟`;
  document.querySelector('#plan-completed').textContent=`${doneCount} / ${plans.length}`;
  const list=document.querySelector('#plan-list');
  if(!plans.length){list.innerHTML='<div class="empty-plan"><strong>今天还没有安排</strong>点击“添加计划”，给重要的事情留出时间。</div>';return}
  list.innerHTML=plans.map(plan=>`<article class="plan-item ${plan.done?'completed':''}" data-id="${escapeHtml(plan.id)}"><div class="plan-time"><strong>${escapeHtml(plan.start)}–${escapeHtml(plan.end)}</strong><small>${plan.done?'已完成':'待完成'}</small></div><div class="plan-item-copy"><h3>${escapeHtml(plan.title)}</h3><p>${escapeHtml(plan.content||'暂无补充内容')}</p></div><span class="plan-duration">${Number(plan.minutes)} 分钟</span><div class="plan-item-actions"><button class="done-button" type="button" data-action="toggle">${plan.done?'恢复':'完成'}</button><button type="button" data-action="edit">编辑</button><button class="delete-button" type="button" data-action="delete">删除</button></div></article>`).join('');
  list.querySelectorAll('[data-action]').forEach(button=>button.addEventListener('click',()=>handlePlanAction(button.closest('.plan-item').dataset.id,button.dataset.action)));
}
function openPlanForm(plan=null){
  const form=document.querySelector('#plan-form');
  form.hidden=false;form.dataset.editId=plan?.id||'';
  document.querySelector('#plan-form-mode').textContent=plan?'编辑计划':'新增计划';
  const defaults=defaultTimes();
  document.querySelector('#plan-start').value=plan?.start||defaults.start;
  document.querySelector('#plan-end').value=plan?.end||defaults.end;
  document.querySelector('#plan-minutes').value=plan?.minutes||30;
  document.querySelector('#plan-title').value=plan?.title||'';
  document.querySelector('#plan-content').value=plan?.content||'';
  form.scrollIntoView({behavior:'smooth',block:'center'});
  document.querySelector('#plan-title').focus();
}
function closePlanForm(){const form=document.querySelector('#plan-form');form.hidden=true;form.reset();form.dataset.editId=''}
function handlePlanAction(id,action){
  const plan=dailyPlans.find(item=>item.id===id);if(!plan)return;
  if(action==='toggle'){plan.done=!plan.done;saveDailyPlans();renderDailyPlans();return}
  if(action==='edit'){openPlanForm(plan);return}
  if(action==='delete'&&confirm(`确定删除“${plan.title}”吗？`)){dailyPlans=dailyPlans.filter(item=>item.id!==id);saveDailyPlans();renderDailyPlans()}
}
function initDailyPlanner(){
  loadDailyPlans();
  const dateInput=document.querySelector('#plan-date');dateInput.value=localDateString();
  dateInput.addEventListener('change',()=>{closePlanForm();renderDailyPlans()});
  document.querySelector('#add-plan-button').addEventListener('click',()=>openPlanForm());
  document.querySelector('#close-plan-form').addEventListener('click',closePlanForm);
  document.querySelector('#plan-cancel').addEventListener('click',closePlanForm);
  ['#plan-start','#plan-end'].forEach(selector=>document.querySelector(selector).addEventListener('change',()=>{const minutes=minutesBetween(document.querySelector('#plan-start').value,document.querySelector('#plan-end').value);if(minutes)document.querySelector('#plan-minutes').value=minutes}));
  document.querySelector('#plan-form').addEventListener('submit',event=>{
    event.preventDefault();
    const form=event.currentTarget;const editId=form.dataset.editId;
    const payload={date:selectedPlanDate(),start:document.querySelector('#plan-start').value,end:document.querySelector('#plan-end').value,minutes:Number(document.querySelector('#plan-minutes').value),title:document.querySelector('#plan-title').value.trim(),content:document.querySelector('#plan-content').value.trim()};
    if(!payload.title||payload.minutes<1)return;
    if(editId){const current=dailyPlans.find(item=>item.id===editId);if(current)Object.assign(current,payload)}else{dailyPlans.push({id:`plan-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,done:false,...payload})}
    saveDailyPlans();closePlanForm();renderDailyPlans();
  });
  renderDailyPlans();
}

document.addEventListener('DOMContentLoaded',()=>{renderScores();renderResult();showRoute('wenyuan');showPrep('written');renderTasks();initDailyPlanner();document.querySelectorAll('[data-route]').forEach(b=>b.addEventListener('click',()=>showRoute(b.dataset.route)));document.querySelectorAll('[data-prep]').forEach(b=>b.addEventListener('click',()=>showPrep(b.dataset.prep)))})
