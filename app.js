(() => {
const $=s=>document.querySelector(s), display=$("#display"),previous=$("#previous"),message=$("#message");
let expression="",degrees=true,lastAnswer="";
const render=()=>{display.textContent=expression||"0";};
function insert(v){if(lastAnswer&&/^[0-9.(πe]/.test(v))expression="";lastAnswer="";expression+=v;message.textContent="";render();}
function clear(){expression="";lastAnswer="";previous.textContent="";message.textContent="";render();}
function del(){expression=expression.slice(0,-1);lastAnswer="";render();}
function factorial(n){if(n<0||!Number.isInteger(n)||n>170)throw Error("فاکتوریل فقط برای اعداد صحیح ۰ تا ۱۷۰ تعریف شده است.");let r=1;for(let i=2;i<=n;i++)r*=i;return r;}
function tokenize(s){
 const tokens=[];let i=0;
 while(i<s.length){let c=s[i];if(/\s/.test(c)){i++;continue;}
 if(/[0-9.]/.test(c)){let m=s.slice(i).match(/^(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/i);if(!m)throw Error("عدد نامعتبر است.");tokens.push({type:"num",v:Number(m[0])});i+=m[0].length;continue;}
 if(/[a-zA-Zπ]/.test(c)){let m=s.slice(i).match(/^[a-zA-Z]+|^π/);let name=m[0];tokens.push({type:"name",v:name});i+=name.length;continue;}
 if("+-−×÷*/^()!%".includes(c)){tokens.push({type:"op",v:c});i++;continue;}throw Error("کاراکتر نامعتبر: "+c);
 }return tokens;
}
function evaluate(source){
 let t=tokenize(source),p=0;
 const peek=()=>t[p],eat=v=>{if(peek()?.v===v){p++;return true}return false};
 function primary(){
  if(eat("+"))return primary();if(eat("-")||eat("−"))return -primary();
  if(eat("(")){let v=add();if(!eat(")"))throw Error("پرانتز بسته نشده است.");return v;}
  let x=peek();if(!x)throw Error("عبارت ناقص است.");
  if(x.type==="num"){p++;return x.v;}
  if(x.type==="name"){
   p++;if(x.v==="π")return Math.PI;if(x.v==="e")return Math.E;
   if(!eat("("))throw Error("بعد از تابع "+x.v+" پرانتز باز لازم است.");
   let a=add();if(!eat(")"))throw Error("پرانتز تابع بسته نشده است.");
   const angle=v=>degrees?v*Math.PI/180:v, unangle=v=>degrees?v*180/Math.PI:v;
   const funcs={sin:v=>Math.sin(angle(v)),cos:v=>Math.cos(angle(v)),tan:v=>Math.tan(angle(v)),asin:v=>unangle(Math.asin(v)),acos:v=>unangle(Math.acos(v)),atan:v=>unangle(Math.atan(v)),sqrt:v=>{if(v<0)throw Error("ریشه عدد منفی حقیقی نیست.");return Math.sqrt(v)},ln:v=>Math.log(v),log:v=>Math.log10(v),abs:v=>Math.abs(v),exp:v=>Math.exp(v)};
   if(!funcs[x.v])throw Error("تابع ناشناخته: "+x.v);return funcs[x.v](a);
  }throw Error("عبارت نامعتبر است.");
 }
 function postfix(v){while(true){if(eat("!"))v=factorial(v);else if(eat("%"))v/=100;else break;}return v;}
 function power(){let v=postfix(primary());if(eat("^"))v=Math.pow(v,power());return v;}
 function mul(){let v=power();while(peek()&&["×","*","÷","/"].includes(peek().v)){let op=t[p++].v,b=power();v=(op==="×"||op==="*")?v*b:v/b;}return v;}
 function add(){let v=mul();while(peek()&&["+","-","−"].includes(peek().v)){let op=t[p++].v,b=mul();v=(op==="+")?v+b:v-b;}return v;}
 let result=add();if(p!==t.length)throw Error("بخشی از عبارت قابل محاسبه نیست.");if(!Number.isFinite(result))throw Error("نتیجه تعریف‌نشده یا خارج از محدوده است.");return result;
}
function calculate(){if(!expression)return;try{let result=evaluate(expression);previous.textContent=expression+" =";expression=String(Number(result.toPrecision(12)));lastAnswer=expression;message.textContent="";render();}catch(e){message.textContent=e.message;}}
document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".tab,.panel").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#"+b.dataset.tab).classList.add("active");}));
document.querySelector(".scientific-keys").addEventListener("click",e=>{let b=e.target.closest("button");if(!b)return;if(b.dataset.insert!==undefined)insert(b.dataset.insert);if(b.dataset.action==="clear")clear();if(b.dataset.action==="delete")del();if(b.dataset.action==="equals")calculate();});
$("#deg").onclick=()=>{degrees=true;$("#deg").classList.add("selected");$("#rad").classList.remove("selected");};
$("#rad").onclick=()=>{degrees=false;$("#rad").classList.add("selected");$("#deg").classList.remove("selected");};
document.addEventListener("keydown",e=>{if(!$("#scientific").classList.contains("active")||e.target.matches("input,select"))return;if(/^[0-9.]$/.test(e.key))insert(e.key);else if(["+","-","*","/","^","(",")","%","!"].includes(e.key))insert(e.key==="*"?"×":e.key==="/"?"÷":e.key);else if(e.key==="Enter"){e.preventDefault();calculate();}else if(e.key==="Backspace")del();else if(e.key==="Escape")clear();});
const units={
length:{m:1,km:1000,cm:.01,mm:.001,µm:1e-6,mi:1609.344,yd:.9144,ft:.3048,in:.0254},
mass:{kg:1,g:.001,mg:1e-6,t:1000,lb:.45359237,oz:.028349523125},
area:{'m²':1,'km²':1e6,'cm²':1e-4,'mm²':1e-6,ha:10000,acre:4046.8564224,'ft²':.09290304},
volume:{'m³':1,L:.001,mL:1e-6,'cm³':1e-6,'ft³':.028316846592,gal: .003785411784},
time:{s:1,min:60,h:3600,day:86400,week:604800},
speed:{'m/s':1,'km/h':1/3.6,mph:.44704,knot:.514444},
data:{bit:1,byte:8,KB:8000,MB:8e6,GB:8e9,KiB:8192,MiB:8388608,GiB:8589934592},
pressure:{Pa:1,kPa:1000,MPa:1e6,bar:100000,atm:101325,psi:6894.757293},
energy:{J:1,kJ:1000,cal:4.184,kcal:4184,Wh:3600,kWh:3600000,eV:1.602176634e-19}
};
const names={length:"متر (m)",mass:"کیلوگرم (kg)",area:"متر مربع (m²)",volume:"متر مکعب (m³)",time:"ثانیه (s)",speed:"متر بر ثانیه (m/s)",data:"بیت (bit)",pressure:"پاسکال (Pa)",energy:"ژول (J)"};
const category=$("#category"),from=$("#fromUnit"),to=$("#toUnit"),value=$("#convertValue"),out=$("#convertResult");
function fillUnits(){let c=category.value,list=c==="temperature"?["°C","°F","K"]:Object.keys(units[c]);from.innerHTML="";to.innerHTML="";list.forEach((u,i)=>{from.add(new Option(u,u));to.add(new Option(u,u));});if(list.length>1)to.selectedIndex=1;convert();}
function convert(){let n=Number(value.value);if(value.value.trim()===""||!Number.isFinite(n)){out.textContent="مقدار معتبر وارد کن";return;}let result;if(category.value==="temperature"){let c=from.value,k;if(c==="°C")k=n+273.15;else if(c==="°F")k=(n-32)*5/9+273.15;else k=n;if(k<0){out.textContent="دمای کمتر از صفر مطلق معتبر نیست";return;}result=to.value==="K"?k:to.value==="°C"?k-273.15:(k-273.15)*9/5+32;}else result=n*units[category.value][from.value]/units[category.value][to.value];out.textContent=Number(result.toPrecision(12)).toLocaleString("en-US",{maximumFractionDigits:12})+" "+to.value;}
category.addEventListener("change",fillUnits);[from,to,value].forEach(x=>x.addEventListener("input",convert));$("#swap").onclick=()=>{let a=from.value;from.value=to.value;to.value=a;convert();};
fillUnits();render();
})();