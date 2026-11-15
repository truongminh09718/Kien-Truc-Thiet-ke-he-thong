const cars=[
  {id:'vf8',brand:'VinFast',name:'VF 8 Plus 2026',body:'SUV',fuel:'Điện',condition:'new',price:1250000000,badge:'Mới 2026',image:'https://ch.canadianautoreview.ca/wp-content/uploads/2024/10/vinfast-vf8-plus-fs1-1024x768.jpg',specs:[['Công suất','402 HP'],['Dẫn động','AWD'],['Pin','471 km']]},
  {id:'eqe',brand:'Mercedes-Benz',name:'EQE SUV 500',body:'SUV',fuel:'Điện',condition:'new',price:3999000000,badge:'SUV điện',image:'https://upload.wikimedia.org/wikipedia/commons/7/77/The_frontview_of_Mercedes-Benz_EQS_450_4MATIC_SUV_%28X296%29.jpg',specs:[['Công suất','408 HP'],['Dẫn động','4MATIC'],['Pin','550 km']]},
  {id:'tucson',brand:'Hyundai',name:'Tucson 1.6 Turbo',body:'SUV',fuel:'Xăng',condition:'new',price:959000000,badge:'Ưu đãi 50 triệu',image:'https://carpassion.vn/wp-content/uploads/2024/04/2025-Hyundai-Tucson-3.jpg',specs:[['Động cơ','180 HP'],['Hộp số','7-DCT'],['An toàn','SmartSense']]},
  {id:'cx5',brand:'Mazda',name:'CX-5 2.5 Signature',body:'SUV',fuel:'Xăng',condition:'used',price:979000000,badge:'Xe đã qua sử dụng',image:'assets/mazda-cx5.jpg',specs:[['Động cơ','188 HP'],['Âm thanh','10 Bose'],['An toàn','i-Activsense']]},
  {id:'camry',brand:'Toyota',name:'Camry 2.5 HEV',body:'Sedan',fuel:'Hybrid',condition:'new',price:1460000000,badge:'Hybrid',image:'https://www.toyotauniversidad.mx/static/agency-go-virtual/Toyota/Camry_Hybrid/2025/Exterior/13.jpg',specs:[['Công suất','211 HP'],['Tiêu hao','4,4 L'],['An toàn','TSS 3.0']]},
  {id:'taycan',brand:'Porsche',name:'Taycan 4S',body:'Coupe',fuel:'Điện',condition:'used',price:4760000000,badge:'Hiệu năng cao',image:'https://hips.hearstapps.com/hmg-prod/images/2025-porsche-taycan-107-660b0444143ff.jpg?crop=1xw%3A1xh%3Bcenter',specs:[['Overboost','530 HP'],['Kiến trúc','800V'],['0–100 km/h','4,0 giây']]}
];

const money=n=>new Intl.NumberFormat('vi-VN').format(n)+' VNĐ';
const grid=document.querySelector('#carGrid');
let quick='all';
let compare=[];

function renderCars(list=cars){
  grid.innerHTML=list.map(car=>`<article class="car-card">
    <div class="car-card__visual"><img src="${car.image}" alt="${car.name}" loading="lazy"><span class="badge">${car.badge}</span></div>
    <div class="car-card__body"><span class="car-card__brand">${car.brand}</span><h3>${car.name}</h3>
      <div class="car-specs">${car.specs.map(s=>`<div><span>${s[0]}</span><strong>${s[1]}</strong></div>`).join('')}</div>
      <div class="car-price"><span>Giá tham khảo</span><strong>${money(car.price)}</strong></div>
      <div class="car-actions"><button data-compare="${car.id}">${compare.includes(car.id)?'Đã chọn':'So sánh xe'}</button><button data-detail="${car.id}">Xem chi tiết</button></div>
    </div></article>`).join('');
  document.querySelector('#resultCopy').textContent=`${list.length} mẫu xe phù hợp`;
}

function filterCars(){
  const brand=document.querySelector('#brandFilter').value;
  const body=document.querySelector('#bodyFilter').value;
  const fuel=document.querySelector('#fuelFilter').value;
  const q=document.querySelector('#queryFilter').value.toLowerCase().trim();
  const list=cars.filter(c=>(brand==='all'||c.brand===brand)&&(body==='all'||c.body===body)&&(fuel==='all'||c.fuel===fuel)&&(quick==='all'||c.fuel===quick||c.body===quick||c.condition===quick)&&(!q||`${c.brand} ${c.name} ${c.body} ${c.fuel} ${c.badge}`.toLowerCase().includes(q)));
  renderCars(list);
  document.querySelector('#inventory').scrollIntoView({behavior:'smooth'});
}

document.querySelector('#searchForm').addEventListener('submit',e=>{e.preventDefault();filterCars()});
document.querySelectorAll('[data-quick]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-quick]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');quick=btn.dataset.quick;filterCars()}));

grid.addEventListener('click',e=>{
  const compareBtn=e.target.closest('[data-compare]');
  const detailBtn=e.target.closest('[data-detail]');
  if(compareBtn){const id=compareBtn.dataset.compare;if(compare.includes(id))compare=compare.filter(x=>x!==id);else if(compare.length<2)compare.push(id);else{compare.shift();compare.push(id)}updateCompare();renderCars()}
  if(detailBtn)openDetail(detailBtn.dataset.detail);
});

function updateCompare(){document.querySelector('#compareCount').textContent=compare.length;const list=document.querySelector('#compareList');list.innerHTML=compare.length?compare.map(id=>{const c=cars.find(x=>x.id===id);return `<div class="compare-item"><span><strong>${c.name}</strong><br>${money(c.price)}</span><button data-remove="${id}">Bỏ xe</button></div>`}).join(''):'<p>Chưa có xe nào trong danh sách so sánh.</p>';}
document.querySelector('#compareList').addEventListener('click',e=>{if(e.target.dataset.remove){compare=compare.filter(x=>x!==e.target.dataset.remove);updateCompare();renderCars()}});

function openDetail(id){const car=cars.find(c=>c.id===id);document.querySelector('#detailContent').innerHTML=`<div class="detail-image"><img src="${car.image}" alt="${car.name}"></div><div class="detail-copy"><p class="eyebrow">${car.brand} · ${car.body}</p><h2>${car.name}</h2><p>Hình ảnh lớn, thông số chính và thao tác lái thử được gom trong một màn hình.</p><ul>${car.specs.map(s=>`<li>${s[0]}: <strong>${s[1]}</strong></li>`).join('')}</ul><p class="price">${money(car.price)}</p><button class="btn btn--primary" data-open-booking>Đặt lịch lái thử</button></div>`;openModal(document.querySelector('#detailModal'))}

function openModal(modal){modal.showModal();document.body.classList.add('modal-open')}
function closeModal(modal){modal.close();document.body.classList.remove('modal-open')}
document.addEventListener('click',e=>{if(e.target.matches('[data-close-modal]'))closeModal(e.target.closest('dialog'));if(e.target.matches('[data-open-booking]')){const d=e.target.closest('dialog');if(d)d.close();resetBooking();openModal(document.querySelector('#bookingModal'))}});
document.querySelectorAll('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d)closeModal(d)}));
document.querySelector('#openCompare').addEventListener('click',()=>openModal(document.querySelector('#compareModal')));
document.querySelector('#comparisonAction').addEventListener('click',()=>openModal(document.querySelector('#compareModal')));
document.querySelector('#openSearch').addEventListener('click',()=>document.querySelector('#queryFilter').focus());

const menuButton=document.querySelector('#menuButton');
menuButton.addEventListener('click',()=>{const nav=document.querySelector('.nav__links');nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',nav.classList.contains('open'))});
document.querySelectorAll('.nav__links a').forEach(a=>a.addEventListener('click',()=>document.querySelector('.nav__links').classList.remove('open')));

document.querySelectorAll('[data-view]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-view]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.querySelector('#studioMode').textContent=btn.dataset.view}));
document.querySelectorAll('[data-color]').forEach((btn,i)=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-color]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.querySelector('#studioVisual img').style.filter=`sepia(${i?'.18':'.35'}) hue-rotate(${i*38}deg) saturate(1.2)`}));
let rotated=false;document.querySelector('#rotateCar').addEventListener('click',()=>{rotated=!rotated;document.querySelector('#studioVisual').style.transform=`perspective(900px) rotateY(${rotated?'-5deg':'0deg'})`});

function calcLoan(){const p=+document.querySelector('#carPrice').value;const down=+document.querySelector('#downPayment').value;const years=+document.querySelector('#loanTerm').value;const principal=p*(1-down/100);const r=.069/12;const months=years*12;const monthly=principal*r*Math.pow(1+r,months)/(Math.pow(1+r,months)-1);document.querySelector('#carPriceText').textContent=money(p);document.querySelector('#downText').textContent=`${down}%`;document.querySelector('#termText').textContent=`${years} năm`;document.querySelector('#monthlyPayment').textContent=money(Math.round(monthly))}
['carPrice','downPayment','loanTerm'].forEach(id=>document.querySelector('#'+id).addEventListener('input',calcLoan));

let step=1;function setStep(n){step=n;document.querySelectorAll('.booking-step').forEach(s=>s.classList.toggle('active',+s.dataset.step===n));document.querySelectorAll('.booking-progress span').forEach((s,i)=>s.classList.toggle('active',i<n))}
function resetBooking(){setStep(1);document.querySelector('#bookingForm').reset();const d=new Date();d.setDate(d.getDate()+1);document.querySelector('[name=date]').min=d.toISOString().split('T')[0];document.querySelector('[name=date]').value=d.toISOString().split('T')[0]}
document.querySelector('.next-step').addEventListener('click',()=>setStep(2));document.querySelector('.prev-step').addEventListener('click',()=>setStep(1));
document.querySelector('#bookingForm').addEventListener('submit',e=>{e.preventDefault();document.querySelector('#bookingCode').textContent='AL-'+String(Date.now()).slice(-6);setStep(3)});

const chatPanel=document.querySelector('#chatPanel');function toggleChat(open=true){chatPanel.classList.toggle('open',open);chatPanel.setAttribute('aria-hidden',String(!open))}
document.querySelector('#chatLauncher').addEventListener('click',()=>toggleChat(!chatPanel.classList.contains('open')));document.querySelector('#closeChat').addEventListener('click',()=>toggleChat(false));document.querySelector('#mobileChat').addEventListener('click',()=>toggleChat(true));
document.querySelector('#chatForm').addEventListener('submit',e=>{e.preventDefault();const input=document.querySelector('#chatInput');if(!input.value.trim())return;const body=document.querySelector('#chatBody');body.insertAdjacentHTML('beforeend',`<p class="user">${input.value.replace(/[<>]/g,'')}</p><p class="bot">Mình đã ghi nhận. Bạn có thể lọc kho xe ngay trên trang hoặc đặt lịch để chuyên viên AutoLux tư vấn chi tiết.</p>`);input.value='';body.scrollTop=body.scrollHeight});

renderCars();updateCompare();calcLoan();resetBooking();
