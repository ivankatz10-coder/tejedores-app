import { useState, useMemo } from "react";

// ── MÁQUINAS REALES ───────────────────────────────────────────────────────────
const MAQUINAS = [
  { num:1,  modelo:"Shima 124-7",         grupo:"G7",  doble:false },
  { num:2,  modelo:"China Vieja-7",        grupo:"G7",  doble:false },
  { num:3,  modelo:"Phanstar-7",           grupo:"G7",  doble:false },
  { num:4,  modelo:"Shima 234-7 Act 8",    grupo:"G7",  doble:true  },
  { num:5,  modelo:"Shima 234-7 Act 5 Y6", grupo:"G7",  doble:true  },
  { num:6,  modelo:"Shima 234-7 Act 5 Y6", grupo:"G7",  doble:true  },
  { num:10, modelo:"Shima-10",             grupo:"G10", doble:true  },
  { num:11, modelo:"Shima-10",             grupo:"G10", doble:true  },
  { num:12, modelo:"Shima-10",             grupo:"G10", doble:true  },
  { num:13, modelo:"Shima-10",             grupo:"G10", doble:true  },
  { num:20, modelo:"SSR",                  grupo:"GSSR",doble:false },
  { num:21, modelo:"SSR",                  grupo:"GSSR",doble:false },
  { num:22, modelo:"SSR",                  grupo:"GSSR",doble:false },
  { num:23, modelo:"SSR",                  grupo:"GSSR",doble:false },
  { num:24, modelo:"SSR",                  grupo:"GSSR",doble:false },
  { num:25, modelo:"SSR",                  grupo:"GSSR",doble:false },
  { num:30, modelo:"Phanstar 10",          grupo:"GP10",doble:false },
  { num:31, modelo:"Phanstar 10",          grupo:"GP10",doble:false },
  { num:32, modelo:"Phanstar 10",          grupo:"GP10",doble:false },
  { num:33, modelo:"Phanstar 10",          grupo:"GP10",doble:false },
  { num:34, modelo:"Phanstar 10",          grupo:"GP10",doble:false },
  { num:35, modelo:"Phanstar 10",          grupo:"GP10",doble:false },
  { num:36, modelo:"Phanstar 10",          grupo:"GP10",doble:false },
  { num:37, modelo:"Phanstar 10",          grupo:"GP10",doble:false },
  { num:38, modelo:"Phanstar 10",          grupo:"GP10",doble:false },
  { num:40, modelo:"Shima 124-12",         grupo:"G12", doble:false },
  { num:41, modelo:"Shima 124-12",         grupo:"G12", doble:false },
  { num:42, modelo:"Shima 234-12",         grupo:"G12", doble:true  },
  { num:43, modelo:"Shima 234-12",         grupo:"G12", doble:true  },
  { num:44, modelo:"Shima 124-12",         grupo:"G12", doble:false },
  { num:45, modelo:"Shima 124-12",         grupo:"G12", doble:false },
  { num:50, modelo:"China Vieja 12",       grupo:"GCV", doble:false },
  { num:51, modelo:"China Vieja 12",       grupo:"GCV", doble:false },
  { num:52, modelo:"China Vieja 12",       grupo:"GCV", doble:false },
  { num:53, modelo:"China Vieja 12",       grupo:"GCV", doble:false },
  { num:54, modelo:"China Vieja 10",       grupo:"GCV", doble:false },
  { num:55, modelo:"China Vieja 12",       grupo:"GCV", doble:false },
  { num:56, modelo:"China Vieja 12",       grupo:"GCV", doble:false },
];

const GRUPOS = [
  { id:"G7",   nombre:"Galga 7"     },
  { id:"G10",  nombre:"Galga 10"    },
  { id:"GSSR", nombre:"SSR"         },
  { id:"GP10", nombre:"Phanstar 10" },
  { id:"G12",  nombre:"Galga 12"    },
  { id:"GCV",  nombre:"China Vieja" },
];

const ARTICULOS = [
  { id:"estandar", nombre:"Artículo estándar", pañosPorPrenda:4 },
  { id:"bufanda",  nombre:"Bufanda",           pañosPorPrenda:1 },
  { id:"ruana",    nombre:"Ruana",             pañosPorPrenda:1 },
  { id:"chalina",  nombre:"Chalina",           pañosPorPrenda:1 },
];
const TALLES = [
  { id:"42", label:"42/XXS" },{ id:"44", label:"44/XS"  },{ id:"46", label:"46/S"   },
  { id:"48", label:"48/M"   },{ id:"50", label:"50/L"   },{ id:"52", label:"52/XL"  },
  { id:"54", label:"54/XXL" },{ id:"56", label:"56/XXXL"},{ id:"58", label:"58/XXXXL"},
  { id:"60", label:"60/XXXXXL"},{ id:"62", label:"62/—" },
];
const TURNOS = [
  { id:"dia",    label:"Día",    horario:"7:30 → 19:30",  maxHoras:12 },
  { id:"noche",  label:"Noche",  horario:"19:30 → 7:30",  maxHoras:12 },
  { id:"sabado", label:"Sábado", horario:"Extra",          maxHoras:12 },
];
const TEJEDORES = ["García","Rodríguez","López","Martínez","González","Pérez","Sánchez","Ramírez","Torres","Flores"];

// ── HELPERS ───────────────────────────────────────────────────────────────────
function uid() { return Math.random().toString(36).slice(2,9); }
function fmtDate(d) { return new Date(d+"T12:00:00").toLocaleDateString("es-AR",{day:"2-digit",month:"2-digit",year:"numeric"}); }
function fmtDia(d) { return new Date(d+"T12:00:00").toLocaleDateString("es-AR",{weekday:"long"}); }
function fmtFechaConDia(d) { const dia=fmtDia(d); return `${fmtDate(d)} — ${dia.charAt(0).toUpperCase()+dia.slice(1)}`; }
function fmtMonth(d) { return new Date(d+"T12:00:00").toLocaleDateString("es-AR",{month:"long",year:"numeric"}); }
function totalPaños(t) { return Object.values(t).reduce((a,b)=>a+Number(b),0); }
function toPrendas(paños,artId) { const a=ARTICULOS.find(x=>x.id===artId)||ARTICULOS[0]; return +(paños/a.pañosPorPrenda).toFixed(1); }
function emptyT() { const o={}; TALLES.forEach(t=>{o[t.id]=0;}); return o; }
function turnoColor(id) { return id==="dia"?C.accent:id==="noche"?C.info:C.success; }

// Semana ISO: lunes a domingo
function weekStart(dateStr) {
  const d=new Date(dateStr+"T12:00:00");
  const day=d.getDay(); const diff=day===0?-6:1-day;
  d.setDate(d.getDate()+diff); return d.toISOString().slice(0,10);
}
function monthOf(dateStr) { return dateStr.slice(0,7); }
function dateInRange(dateStr,from,to) { return dateStr>=from && dateStr<=to; }
function addDays(dateStr,n) {
  const d=new Date(dateStr+"T12:00:00"); d.setDate(d.getDate()+n);
  return d.toISOString().slice(0,10);
}

// ── COLORES ───────────────────────────────────────────────────────────────────
const C = {
  bg:"#0f0e0d", surface:"#1a1816", card:"#221f1c", border:"#332e29",
  accent:"#e8a838", text:"#f0e8dc", muted:"#8a7d6e",
  danger:"#e05c3a", success:"#5aac7e", info:"#7a8ee0", warn:"#e07a3a",
};
const iSt = { background:C.surface,border:`1px solid ${C.border}`,color:C.text,borderRadius:6,padding:"9px 12px",fontSize:14,fontFamily:"inherit",outline:"none",width:"100%",boxSizing:"border-box" };
const thSt = { padding:"9px 14px",fontSize:11,fontWeight:700,color:C.muted,letterSpacing:"0.07em",textTransform:"uppercase",borderBottom:`2px solid ${C.border}`,textAlign:"left",whiteSpace:"nowrap" };
const tdSt = { padding:"10px 14px",borderBottom:`1px solid ${C.border}`,fontSize:13,color:C.text,verticalAlign:"middle" };

function Pill({color,text}){ return <span style={{background:color+"22",color,border:`1px solid ${color}55`,borderRadius:4,padding:"2px 8px",fontSize:11,fontWeight:700,letterSpacing:"0.05em",textTransform:"uppercase"}}>{text}</span>; }
function Field({label,sub,children}){
  return (
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      <label style={{fontSize:11,fontWeight:700,color:C.muted,letterSpacing:"0.08em",textTransform:"uppercase"}}>
        {label}{sub&&<span style={{fontWeight:400,marginLeft:6,color:C.muted,fontSize:10,textTransform:"none",letterSpacing:0}}>{sub}</span>}
      </label>
      {children}
    </div>
  );
}

// ── DEMO DATA ─────────────────────────────────────────────────────────────────
function mkT(vals){ const o=emptyT(); Object.entries(vals).forEach(([k,v])=>{o[k]=v;}); return o; }

// Genera registros para múltiples días con variación realista
function genDays(days) {
  const regs=[];
  const maqsActivas=[1,2,3,4,5,6,10,11,12,13,20,21,22,23,24,25,30,31,32,33,34,35,36,37,38,40,41,42,43,44,45,50,51,52,53,54,55,56];
  days.forEach(fecha=>{
    maqsActivas.forEach(num=>{
      const maq=MAQUINAS.find(m=>m.num===num);
      if(!maq)return;
      // algunas máquinas paradas aleatoriamente
      const parada=Math.random()<0.08;
      if(parada)return;
      TURNOS.forEach(turno=>{
        const tej=TEJEDORES[Math.floor(Math.random()*TEJEDORES.length)];
        const base=maq.doble?20:10;
        const talles={};
        TALLES.forEach(t=>{
          const v=Math.random()<0.7?Math.floor(Math.random()*base)+2:0;
          talles[t.id]=v;
        });
        const obs=Math.random()<0.05?["Tensión irregular","Rotura de aguja","Paró 1h por falla","Defecto de color"][Math.floor(Math.random()*4)]:"";
        regs.push({id:uid(),lote:`L-${String(Math.floor(num/10+1)).padStart(3,"0")}`,maqNum:num,fecha,tejedor:tej,turno:turno.id,articulo:"estandar",obs,talles:mkT(talles)});
      });
    });
  });
  return regs;
}

// Genera 30 días de datos
const HOY="2026-03-20";
const DAYS_30=Array.from({length:30},(_,i)=>addDays("2026-02-19",i));
// Datos reales: enero + febrero + marzo 2026 (sábados marcados como turno extra)
const DATOS_XLSX = [
  {id:"e0",lote:"—",maqNum:1,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1",lote:"—",maqNum:4,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e2",lote:"—",maqNum:5,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:108,talles:{"42":0,"44":0,"46":0,"48":108,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e3",lote:"—",maqNum:6,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e4",lote:"—",maqNum:10,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e5",lote:"—",maqNum:10,fecha:"2026-01-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:74,talles:{"42":0,"44":0,"46":0,"48":74,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e6",lote:"—",maqNum:11,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e7",lote:"—",maqNum:11,fecha:"2026-01-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:74,talles:{"42":0,"44":0,"46":0,"48":74,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e8",lote:"—",maqNum:12,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e9",lote:"—",maqNum:12,fecha:"2026-01-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e10",lote:"—",maqNum:13,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e11",lote:"—",maqNum:13,fecha:"2026-01-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:76,talles:{"42":0,"44":0,"46":0,"48":76,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e12",lote:"—",maqNum:20,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e13",lote:"—",maqNum:20,fecha:"2026-01-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e14",lote:"—",maqNum:21,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e15",lote:"—",maqNum:21,fecha:"2026-01-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e16",lote:"—",maqNum:22,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e17",lote:"—",maqNum:22,fecha:"2026-01-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e18",lote:"—",maqNum:23,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e19",lote:"—",maqNum:23,fecha:"2026-01-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:51,talles:{"42":0,"44":0,"46":0,"48":51,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e20",lote:"—",maqNum:24,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e21",lote:"—",maqNum:24,fecha:"2026-01-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:51,talles:{"42":0,"44":0,"46":0,"48":51,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e22",lote:"—",maqNum:25,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e23",lote:"—",maqNum:25,fecha:"2026-01-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e24",lote:"—",maqNum:3,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:58,talles:{"42":0,"44":0,"46":0,"48":58,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e25",lote:"—",maqNum:3,fecha:"2026-01-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e26",lote:"—",maqNum:30,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:19,talles:{"42":0,"44":0,"46":0,"48":19,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e27",lote:"—",maqNum:30,fecha:"2026-01-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e28",lote:"—",maqNum:31,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e29",lote:"—",maqNum:31,fecha:"2026-01-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e30",lote:"—",maqNum:32,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e31",lote:"—",maqNum:32,fecha:"2026-01-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e32",lote:"—",maqNum:33,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e33",lote:"—",maqNum:33,fecha:"2026-01-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e34",lote:"—",maqNum:34,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e35",lote:"—",maqNum:34,fecha:"2026-01-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e36",lote:"—",maqNum:35,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e37",lote:"—",maqNum:35,fecha:"2026-01-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:51,talles:{"42":0,"44":0,"46":0,"48":51,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e38",lote:"—",maqNum:36,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e39",lote:"—",maqNum:36,fecha:"2026-01-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e40",lote:"—",maqNum:37,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e41",lote:"—",maqNum:37,fecha:"2026-01-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e42",lote:"—",maqNum:38,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e43",lote:"—",maqNum:38,fecha:"2026-01-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e44",lote:"—",maqNum:40,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e45",lote:"—",maqNum:40,fecha:"2026-01-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e46",lote:"—",maqNum:41,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e47",lote:"—",maqNum:41,fecha:"2026-01-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e48",lote:"—",maqNum:42,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e49",lote:"—",maqNum:42,fecha:"2026-01-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e50",lote:"—",maqNum:45,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e51",lote:"—",maqNum:45,fecha:"2026-01-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e52",lote:"—",maqNum:50,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e53",lote:"—",maqNum:51,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e54",lote:"—",maqNum:55,fecha:"2026-01-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e55",lote:"—",maqNum:1,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e56",lote:"—",maqNum:4,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e57",lote:"—",maqNum:5,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e58",lote:"—",maqNum:6,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e59",lote:"—",maqNum:10,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e60",lote:"—",maqNum:10,fecha:"2026-01-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e61",lote:"—",maqNum:11,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:58,talles:{"42":0,"44":0,"46":0,"48":58,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e62",lote:"—",maqNum:11,fecha:"2026-01-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e63",lote:"—",maqNum:12,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:58,talles:{"42":0,"44":0,"46":0,"48":58,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e64",lote:"—",maqNum:12,fecha:"2026-01-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e65",lote:"—",maqNum:13,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e66",lote:"—",maqNum:13,fecha:"2026-01-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:76,talles:{"42":0,"44":0,"46":0,"48":76,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e67",lote:"—",maqNum:20,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e68",lote:"—",maqNum:20,fecha:"2026-01-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e69",lote:"—",maqNum:21,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:61,talles:{"42":0,"44":0,"46":0,"48":61,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e70",lote:"—",maqNum:21,fecha:"2026-01-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e71",lote:"—",maqNum:22,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e72",lote:"—",maqNum:22,fecha:"2026-01-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e73",lote:"—",maqNum:23,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e74",lote:"—",maqNum:23,fecha:"2026-01-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e75",lote:"—",maqNum:24,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:71,talles:{"42":0,"44":0,"46":0,"48":71,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e76",lote:"—",maqNum:24,fecha:"2026-01-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e77",lote:"—",maqNum:25,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:69,talles:{"42":0,"44":0,"46":0,"48":69,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e78",lote:"—",maqNum:25,fecha:"2026-01-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:57,talles:{"42":0,"44":0,"46":0,"48":57,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e79",lote:"—",maqNum:3,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e80",lote:"—",maqNum:30,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e81",lote:"—",maqNum:30,fecha:"2026-01-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e82",lote:"—",maqNum:31,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:51,talles:{"42":0,"44":0,"46":0,"48":51,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e83",lote:"—",maqNum:31,fecha:"2026-01-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e84",lote:"—",maqNum:32,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:49,talles:{"42":0,"44":0,"46":0,"48":49,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e85",lote:"—",maqNum:32,fecha:"2026-01-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e86",lote:"—",maqNum:33,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e87",lote:"—",maqNum:33,fecha:"2026-01-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e88",lote:"—",maqNum:34,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e89",lote:"—",maqNum:34,fecha:"2026-01-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e90",lote:"—",maqNum:35,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:59,talles:{"42":0,"44":0,"46":0,"48":59,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e91",lote:"—",maqNum:35,fecha:"2026-01-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e92",lote:"—",maqNum:36,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e93",lote:"—",maqNum:36,fecha:"2026-01-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e94",lote:"—",maqNum:37,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e95",lote:"—",maqNum:37,fecha:"2026-01-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e96",lote:"—",maqNum:38,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e97",lote:"—",maqNum:38,fecha:"2026-01-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e98",lote:"—",maqNum:40,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:97,talles:{"42":0,"44":0,"46":0,"48":97,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e99",lote:"—",maqNum:41,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e100",lote:"—",maqNum:42,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:64,talles:{"42":0,"44":0,"46":0,"48":64,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e101",lote:"—",maqNum:43,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e102",lote:"—",maqNum:45,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e103",lote:"—",maqNum:50,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e104",lote:"—",maqNum:51,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e105",lote:"—",maqNum:55,fecha:"2026-01-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e106",lote:"—",maqNum:1,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e107",lote:"—",maqNum:5,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e108",lote:"—",maqNum:6,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e109",lote:"—",maqNum:10,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:64,talles:{"42":0,"44":0,"46":0,"48":64,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e110",lote:"—",maqNum:10,fecha:"2026-01-07",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e111",lote:"—",maqNum:11,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:78,talles:{"42":0,"44":0,"46":0,"48":78,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e112",lote:"—",maqNum:11,fecha:"2026-01-07",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e113",lote:"—",maqNum:12,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:64,talles:{"42":0,"44":0,"46":0,"48":64,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e114",lote:"—",maqNum:12,fecha:"2026-01-07",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:78,talles:{"42":0,"44":0,"46":0,"48":78,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e115",lote:"—",maqNum:13,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:78,talles:{"42":0,"44":0,"46":0,"48":78,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e116",lote:"—",maqNum:13,fecha:"2026-01-07",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:74,talles:{"42":0,"44":0,"46":0,"48":74,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e117",lote:"—",maqNum:20,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e118",lote:"—",maqNum:20,fecha:"2026-01-07",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e119",lote:"—",maqNum:21,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:61,talles:{"42":0,"44":0,"46":0,"48":61,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e120",lote:"—",maqNum:21,fecha:"2026-01-07",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e121",lote:"—",maqNum:22,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e122",lote:"—",maqNum:22,fecha:"2026-01-07",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e123",lote:"—",maqNum:23,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e124",lote:"—",maqNum:23,fecha:"2026-01-07",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e125",lote:"—",maqNum:24,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e126",lote:"—",maqNum:24,fecha:"2026-01-07",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e127",lote:"—",maqNum:25,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:55,talles:{"42":0,"44":0,"46":0,"48":55,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e128",lote:"—",maqNum:25,fecha:"2026-01-07",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e129",lote:"—",maqNum:3,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e130",lote:"—",maqNum:30,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e131",lote:"—",maqNum:30,fecha:"2026-01-07",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e132",lote:"—",maqNum:31,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e133",lote:"—",maqNum:31,fecha:"2026-01-07",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e134",lote:"—",maqNum:32,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e135",lote:"—",maqNum:32,fecha:"2026-01-07",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e136",lote:"—",maqNum:33,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e137",lote:"—",maqNum:33,fecha:"2026-01-07",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e138",lote:"—",maqNum:34,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:53,talles:{"42":0,"44":0,"46":0,"48":53,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e139",lote:"—",maqNum:34,fecha:"2026-01-07",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e140",lote:"—",maqNum:35,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:53,talles:{"42":0,"44":0,"46":0,"48":53,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e141",lote:"—",maqNum:35,fecha:"2026-01-07",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e142",lote:"—",maqNum:36,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e143",lote:"—",maqNum:36,fecha:"2026-01-07",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e144",lote:"—",maqNum:37,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e145",lote:"—",maqNum:37,fecha:"2026-01-07",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e146",lote:"—",maqNum:38,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e147",lote:"—",maqNum:38,fecha:"2026-01-07",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e148",lote:"—",maqNum:40,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:100,talles:{"42":0,"44":0,"46":0,"48":100,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e149",lote:"—",maqNum:41,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e150",lote:"—",maqNum:42,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:90,talles:{"42":0,"44":0,"46":0,"48":90,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e151",lote:"—",maqNum:43,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e152",lote:"—",maqNum:45,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e153",lote:"—",maqNum:50,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e154",lote:"—",maqNum:51,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e155",lote:"—",maqNum:55,fecha:"2026-01-07",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e156",lote:"—",maqNum:1,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:49,talles:{"42":0,"44":0,"46":0,"48":49,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e157",lote:"—",maqNum:4,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e158",lote:"—",maqNum:5,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:96,talles:{"42":0,"44":0,"46":0,"48":96,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e159",lote:"—",maqNum:6,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e160",lote:"—",maqNum:10,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:63,talles:{"42":0,"44":0,"46":0,"48":63,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e161",lote:"—",maqNum:10,fecha:"2026-01-08",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e162",lote:"—",maqNum:11,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:78,talles:{"42":0,"44":0,"46":0,"48":78,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e163",lote:"—",maqNum:11,fecha:"2026-01-08",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e164",lote:"—",maqNum:12,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:76,talles:{"42":0,"44":0,"46":0,"48":76,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e165",lote:"—",maqNum:12,fecha:"2026-01-08",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e166",lote:"—",maqNum:13,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:80,talles:{"42":0,"44":0,"46":0,"48":80,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e167",lote:"—",maqNum:13,fecha:"2026-01-08",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:76,talles:{"42":0,"44":0,"46":0,"48":76,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e168",lote:"—",maqNum:20,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e169",lote:"—",maqNum:21,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e170",lote:"—",maqNum:22,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e171",lote:"—",maqNum:23,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e172",lote:"—",maqNum:24,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e173",lote:"—",maqNum:25,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:73,talles:{"42":0,"44":0,"46":0,"48":73,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e174",lote:"—",maqNum:3,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e175",lote:"—",maqNum:30,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e176",lote:"—",maqNum:30,fecha:"2026-01-08",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e177",lote:"—",maqNum:31,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e178",lote:"—",maqNum:31,fecha:"2026-01-08",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e179",lote:"—",maqNum:32,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e180",lote:"—",maqNum:32,fecha:"2026-01-08",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e181",lote:"—",maqNum:33,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e182",lote:"—",maqNum:33,fecha:"2026-01-08",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e183",lote:"—",maqNum:34,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e184",lote:"—",maqNum:34,fecha:"2026-01-08",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e185",lote:"—",maqNum:35,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:51,talles:{"42":0,"44":0,"46":0,"48":51,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e186",lote:"—",maqNum:35,fecha:"2026-01-08",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e187",lote:"—",maqNum:36,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e188",lote:"—",maqNum:36,fecha:"2026-01-08",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e189",lote:"—",maqNum:37,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e190",lote:"—",maqNum:37,fecha:"2026-01-08",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e191",lote:"—",maqNum:38,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e192",lote:"—",maqNum:38,fecha:"2026-01-08",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e193",lote:"—",maqNum:40,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e194",lote:"—",maqNum:41,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e195",lote:"—",maqNum:42,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:96,talles:{"42":0,"44":0,"46":0,"48":96,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e196",lote:"—",maqNum:43,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e197",lote:"—",maqNum:45,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e198",lote:"—",maqNum:50,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e199",lote:"—",maqNum:51,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e200",lote:"—",maqNum:55,fecha:"2026-01-08",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e201",lote:"—",maqNum:1,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e202",lote:"—",maqNum:4,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e203",lote:"—",maqNum:5,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e204",lote:"—",maqNum:6,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:130,talles:{"42":0,"44":0,"46":0,"48":130,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e205",lote:"—",maqNum:10,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e206",lote:"—",maqNum:10,fecha:"2026-01-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e207",lote:"—",maqNum:11,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e208",lote:"—",maqNum:11,fecha:"2026-01-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e209",lote:"—",maqNum:12,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e210",lote:"—",maqNum:12,fecha:"2026-01-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e211",lote:"—",maqNum:13,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e212",lote:"—",maqNum:13,fecha:"2026-01-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e213",lote:"—",maqNum:20,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e214",lote:"—",maqNum:20,fecha:"2026-01-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e215",lote:"—",maqNum:21,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e216",lote:"—",maqNum:21,fecha:"2026-01-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e217",lote:"—",maqNum:22,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e218",lote:"—",maqNum:22,fecha:"2026-01-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e219",lote:"—",maqNum:23,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e220",lote:"—",maqNum:23,fecha:"2026-01-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e221",lote:"—",maqNum:24,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e222",lote:"—",maqNum:24,fecha:"2026-01-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e223",lote:"—",maqNum:25,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:78,talles:{"42":0,"44":0,"46":0,"48":78,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e224",lote:"—",maqNum:25,fecha:"2026-01-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:49,talles:{"42":0,"44":0,"46":0,"48":49,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e225",lote:"—",maqNum:3,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e226",lote:"—",maqNum:3,fecha:"2026-01-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e227",lote:"—",maqNum:30,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e228",lote:"—",maqNum:30,fecha:"2026-01-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e229",lote:"—",maqNum:31,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e230",lote:"—",maqNum:31,fecha:"2026-01-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e231",lote:"—",maqNum:32,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e232",lote:"—",maqNum:32,fecha:"2026-01-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e233",lote:"—",maqNum:33,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e234",lote:"—",maqNum:33,fecha:"2026-01-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e235",lote:"—",maqNum:34,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e236",lote:"—",maqNum:34,fecha:"2026-01-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:49,talles:{"42":0,"44":0,"46":0,"48":49,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e237",lote:"—",maqNum:35,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e238",lote:"—",maqNum:35,fecha:"2026-01-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e239",lote:"—",maqNum:36,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e240",lote:"—",maqNum:36,fecha:"2026-01-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e241",lote:"—",maqNum:37,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e242",lote:"—",maqNum:37,fecha:"2026-01-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e243",lote:"—",maqNum:38,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e244",lote:"—",maqNum:38,fecha:"2026-01-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e245",lote:"—",maqNum:40,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e246",lote:"—",maqNum:40,fecha:"2026-01-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:49,talles:{"42":0,"44":0,"46":0,"48":49,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e247",lote:"—",maqNum:41,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e248",lote:"—",maqNum:41,fecha:"2026-01-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e249",lote:"—",maqNum:42,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:74,talles:{"42":0,"44":0,"46":0,"48":74,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e250",lote:"—",maqNum:42,fecha:"2026-01-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:84,talles:{"42":0,"44":0,"46":0,"48":84,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e251",lote:"—",maqNum:43,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e252",lote:"—",maqNum:43,fecha:"2026-01-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e253",lote:"—",maqNum:45,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e254",lote:"—",maqNum:45,fecha:"2026-01-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e255",lote:"—",maqNum:50,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e256",lote:"—",maqNum:51,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e257",lote:"—",maqNum:55,fecha:"2026-01-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e258",lote:"—",maqNum:1,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e259",lote:"—",maqNum:1,fecha:"2026-01-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e260",lote:"—",maqNum:4,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e261",lote:"—",maqNum:4,fecha:"2026-01-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e262",lote:"—",maqNum:5,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e263",lote:"—",maqNum:5,fecha:"2026-01-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e264",lote:"—",maqNum:6,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:82,talles:{"42":0,"44":0,"46":0,"48":82,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e265",lote:"—",maqNum:6,fecha:"2026-01-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e266",lote:"—",maqNum:10,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e267",lote:"—",maqNum:11,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e268",lote:"—",maqNum:12,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e269",lote:"—",maqNum:13,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:65,talles:{"42":0,"44":0,"46":0,"48":65,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e270",lote:"—",maqNum:20,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e271",lote:"—",maqNum:20,fecha:"2026-01-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e272",lote:"—",maqNum:21,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e273",lote:"—",maqNum:21,fecha:"2026-01-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e274",lote:"—",maqNum:22,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e275",lote:"—",maqNum:22,fecha:"2026-01-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e276",lote:"—",maqNum:23,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e277",lote:"—",maqNum:23,fecha:"2026-01-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e278",lote:"—",maqNum:24,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:65,talles:{"42":0,"44":0,"46":0,"48":65,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e279",lote:"—",maqNum:24,fecha:"2026-01-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:55,talles:{"42":0,"44":0,"46":0,"48":55,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e280",lote:"—",maqNum:25,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e281",lote:"—",maqNum:25,fecha:"2026-01-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e282",lote:"—",maqNum:3,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e283",lote:"—",maqNum:3,fecha:"2026-01-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:19,talles:{"42":0,"44":0,"46":0,"48":19,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e284",lote:"—",maqNum:30,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:19,talles:{"42":0,"44":0,"46":0,"48":19,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e285",lote:"—",maqNum:30,fecha:"2026-01-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:13,talles:{"42":0,"44":0,"46":0,"48":13,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e286",lote:"—",maqNum:31,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e287",lote:"—",maqNum:31,fecha:"2026-01-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e288",lote:"—",maqNum:32,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e289",lote:"—",maqNum:32,fecha:"2026-01-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e290",lote:"—",maqNum:33,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e291",lote:"—",maqNum:33,fecha:"2026-01-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e292",lote:"—",maqNum:34,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:21,talles:{"42":0,"44":0,"46":0,"48":21,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e293",lote:"—",maqNum:34,fecha:"2026-01-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:10,talles:{"42":0,"44":0,"46":0,"48":10,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e294",lote:"—",maqNum:35,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e295",lote:"—",maqNum:35,fecha:"2026-01-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e296",lote:"—",maqNum:36,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e297",lote:"—",maqNum:36,fecha:"2026-01-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e298",lote:"—",maqNum:37,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:55,talles:{"42":0,"44":0,"46":0,"48":55,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e299",lote:"—",maqNum:37,fecha:"2026-01-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e300",lote:"—",maqNum:38,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:8,talles:{"42":0,"44":0,"46":0,"48":8,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e301",lote:"—",maqNum:38,fecha:"2026-01-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e302",lote:"—",maqNum:40,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:51,talles:{"42":0,"44":0,"46":0,"48":51,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e303",lote:"—",maqNum:40,fecha:"2026-01-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e304",lote:"—",maqNum:41,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e305",lote:"—",maqNum:41,fecha:"2026-01-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e306",lote:"—",maqNum:42,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:88,talles:{"42":0,"44":0,"46":0,"48":88,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e307",lote:"—",maqNum:42,fecha:"2026-01-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:108,talles:{"42":0,"44":0,"46":0,"48":108,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e308",lote:"—",maqNum:43,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e309",lote:"—",maqNum:43,fecha:"2026-01-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e310",lote:"—",maqNum:45,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e311",lote:"—",maqNum:45,fecha:"2026-01-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e312",lote:"—",maqNum:50,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e313",lote:"—",maqNum:51,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e314",lote:"—",maqNum:55,fecha:"2026-01-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e315",lote:"—",maqNum:1,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e316",lote:"—",maqNum:1,fecha:"2026-01-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e317",lote:"—",maqNum:4,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e318",lote:"—",maqNum:4,fecha:"2026-01-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e319",lote:"—",maqNum:5,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e320",lote:"—",maqNum:5,fecha:"2026-01-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e321",lote:"—",maqNum:6,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e322",lote:"—",maqNum:6,fecha:"2026-01-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:86,talles:{"42":0,"44":0,"46":0,"48":86,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e323",lote:"—",maqNum:10,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e324",lote:"—",maqNum:11,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e325",lote:"—",maqNum:12,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e326",lote:"—",maqNum:13,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e327",lote:"—",maqNum:20,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e328",lote:"—",maqNum:20,fecha:"2026-01-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e329",lote:"—",maqNum:21,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e330",lote:"—",maqNum:21,fecha:"2026-01-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e331",lote:"—",maqNum:22,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e332",lote:"—",maqNum:22,fecha:"2026-01-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e333",lote:"—",maqNum:23,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e334",lote:"—",maqNum:23,fecha:"2026-01-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e335",lote:"—",maqNum:24,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:65,talles:{"42":0,"44":0,"46":0,"48":65,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e336",lote:"—",maqNum:24,fecha:"2026-01-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:55,talles:{"42":0,"44":0,"46":0,"48":55,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e337",lote:"—",maqNum:25,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:71,talles:{"42":0,"44":0,"46":0,"48":71,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e338",lote:"—",maqNum:25,fecha:"2026-01-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e339",lote:"—",maqNum:3,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e340",lote:"—",maqNum:3,fecha:"2026-01-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e341",lote:"—",maqNum:30,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e342",lote:"—",maqNum:30,fecha:"2026-01-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e343",lote:"—",maqNum:31,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e344",lote:"—",maqNum:31,fecha:"2026-01-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e345",lote:"—",maqNum:32,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e346",lote:"—",maqNum:32,fecha:"2026-01-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e347",lote:"—",maqNum:33,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e348",lote:"—",maqNum:33,fecha:"2026-01-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e349",lote:"—",maqNum:34,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:57,talles:{"42":0,"44":0,"46":0,"48":57,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e350",lote:"—",maqNum:34,fecha:"2026-01-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e351",lote:"—",maqNum:35,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:59,talles:{"42":0,"44":0,"46":0,"48":59,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e352",lote:"—",maqNum:35,fecha:"2026-01-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e353",lote:"—",maqNum:36,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e354",lote:"—",maqNum:36,fecha:"2026-01-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e355",lote:"—",maqNum:37,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e356",lote:"—",maqNum:37,fecha:"2026-01-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e357",lote:"—",maqNum:38,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e358",lote:"—",maqNum:38,fecha:"2026-01-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e359",lote:"—",maqNum:40,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e360",lote:"—",maqNum:40,fecha:"2026-01-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:91,talles:{"42":0,"44":0,"46":0,"48":91,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e361",lote:"—",maqNum:41,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e362",lote:"—",maqNum:41,fecha:"2026-01-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e363",lote:"—",maqNum:42,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:98,talles:{"42":0,"44":0,"46":0,"48":98,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e364",lote:"—",maqNum:42,fecha:"2026-01-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:114,talles:{"42":0,"44":0,"46":0,"48":114,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e365",lote:"—",maqNum:43,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e366",lote:"—",maqNum:43,fecha:"2026-01-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e367",lote:"—",maqNum:45,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e368",lote:"—",maqNum:45,fecha:"2026-01-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e369",lote:"—",maqNum:50,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e370",lote:"—",maqNum:51,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e371",lote:"—",maqNum:55,fecha:"2026-01-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e372",lote:"—",maqNum:1,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e373",lote:"—",maqNum:1,fecha:"2026-01-14",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e374",lote:"—",maqNum:4,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e375",lote:"—",maqNum:4,fecha:"2026-01-14",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:4,talles:{"42":0,"44":0,"46":0,"48":4,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e376",lote:"—",maqNum:5,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e377",lote:"—",maqNum:5,fecha:"2026-01-14",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:76,talles:{"42":0,"44":0,"46":0,"48":76,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e378",lote:"—",maqNum:6,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e379",lote:"—",maqNum:10,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e380",lote:"—",maqNum:11,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e381",lote:"—",maqNum:12,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e382",lote:"—",maqNum:13,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e383",lote:"—",maqNum:20,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e384",lote:"—",maqNum:20,fecha:"2026-01-14",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e385",lote:"—",maqNum:21,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e386",lote:"—",maqNum:21,fecha:"2026-01-14",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:51,talles:{"42":0,"44":0,"46":0,"48":51,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e387",lote:"—",maqNum:22,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:49,talles:{"42":0,"44":0,"46":0,"48":49,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e388",lote:"—",maqNum:22,fecha:"2026-01-14",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e389",lote:"—",maqNum:23,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:51,talles:{"42":0,"44":0,"46":0,"48":51,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e390",lote:"—",maqNum:23,fecha:"2026-01-14",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e391",lote:"—",maqNum:24,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:67,talles:{"42":0,"44":0,"46":0,"48":67,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e392",lote:"—",maqNum:24,fecha:"2026-01-14",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:55,talles:{"42":0,"44":0,"46":0,"48":55,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e393",lote:"—",maqNum:25,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e394",lote:"—",maqNum:25,fecha:"2026-01-14",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e395",lote:"—",maqNum:3,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e396",lote:"—",maqNum:3,fecha:"2026-01-14",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:55,talles:{"42":0,"44":0,"46":0,"48":55,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e397",lote:"—",maqNum:30,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e398",lote:"—",maqNum:30,fecha:"2026-01-14",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e399",lote:"—",maqNum:31,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e400",lote:"—",maqNum:31,fecha:"2026-01-14",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e401",lote:"—",maqNum:32,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e402",lote:"—",maqNum:32,fecha:"2026-01-14",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e403",lote:"—",maqNum:33,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e404",lote:"—",maqNum:33,fecha:"2026-01-14",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e405",lote:"—",maqNum:34,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e406",lote:"—",maqNum:34,fecha:"2026-01-14",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e407",lote:"—",maqNum:35,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e408",lote:"—",maqNum:35,fecha:"2026-01-14",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e409",lote:"—",maqNum:36,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e410",lote:"—",maqNum:36,fecha:"2026-01-14",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e411",lote:"—",maqNum:37,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e412",lote:"—",maqNum:37,fecha:"2026-01-14",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e413",lote:"—",maqNum:38,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e414",lote:"—",maqNum:38,fecha:"2026-01-14",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e415",lote:"—",maqNum:40,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:88,talles:{"42":0,"44":0,"46":0,"48":88,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e416",lote:"—",maqNum:40,fecha:"2026-01-14",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:63,talles:{"42":0,"44":0,"46":0,"48":63,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e417",lote:"—",maqNum:41,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:87,talles:{"42":0,"44":0,"46":0,"48":87,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e418",lote:"—",maqNum:41,fecha:"2026-01-14",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:55,talles:{"42":0,"44":0,"46":0,"48":55,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e419",lote:"—",maqNum:42,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:98,talles:{"42":0,"44":0,"46":0,"48":98,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e420",lote:"—",maqNum:42,fecha:"2026-01-14",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e421",lote:"—",maqNum:43,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e422",lote:"—",maqNum:43,fecha:"2026-01-14",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e423",lote:"—",maqNum:45,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e424",lote:"—",maqNum:45,fecha:"2026-01-14",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e425",lote:"—",maqNum:50,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:13,talles:{"42":0,"44":0,"46":0,"48":13,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e426",lote:"—",maqNum:51,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:13,talles:{"42":0,"44":0,"46":0,"48":13,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e427",lote:"—",maqNum:55,fecha:"2026-01-14",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e428",lote:"—",maqNum:1,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:69,talles:{"42":0,"44":0,"46":0,"48":69,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e429",lote:"—",maqNum:1,fecha:"2026-01-15",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e430",lote:"—",maqNum:5,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e431",lote:"—",maqNum:5,fecha:"2026-01-15",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:82,talles:{"42":0,"44":0,"46":0,"48":82,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e432",lote:"—",maqNum:6,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:102,talles:{"42":0,"44":0,"46":0,"48":102,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e433",lote:"—",maqNum:6,fecha:"2026-01-15",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e434",lote:"—",maqNum:10,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e435",lote:"—",maqNum:11,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:64,talles:{"42":0,"44":0,"46":0,"48":64,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e436",lote:"—",maqNum:12,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:6,talles:{"42":0,"44":0,"46":0,"48":6,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e437",lote:"—",maqNum:13,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e438",lote:"—",maqNum:20,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e439",lote:"—",maqNum:20,fecha:"2026-01-15",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e440",lote:"—",maqNum:21,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:58,talles:{"42":0,"44":0,"46":0,"48":58,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e441",lote:"—",maqNum:21,fecha:"2026-01-15",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e442",lote:"—",maqNum:22,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:49,talles:{"42":0,"44":0,"46":0,"48":49,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e443",lote:"—",maqNum:22,fecha:"2026-01-15",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e444",lote:"—",maqNum:23,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e445",lote:"—",maqNum:23,fecha:"2026-01-15",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e446",lote:"—",maqNum:24,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e447",lote:"—",maqNum:24,fecha:"2026-01-15",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e448",lote:"—",maqNum:25,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:82,talles:{"42":0,"44":0,"46":0,"48":82,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e449",lote:"—",maqNum:25,fecha:"2026-01-15",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e450",lote:"—",maqNum:3,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e451",lote:"—",maqNum:3,fecha:"2026-01-15",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:63,talles:{"42":0,"44":0,"46":0,"48":63,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e452",lote:"—",maqNum:30,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e453",lote:"—",maqNum:30,fecha:"2026-01-15",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e454",lote:"—",maqNum:31,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e455",lote:"—",maqNum:31,fecha:"2026-01-15",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e456",lote:"—",maqNum:32,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e457",lote:"—",maqNum:32,fecha:"2026-01-15",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e458",lote:"—",maqNum:33,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e459",lote:"—",maqNum:33,fecha:"2026-01-15",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e460",lote:"—",maqNum:34,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e461",lote:"—",maqNum:34,fecha:"2026-01-15",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e462",lote:"—",maqNum:35,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:57,talles:{"42":0,"44":0,"46":0,"48":57,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e463",lote:"—",maqNum:35,fecha:"2026-01-15",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e464",lote:"—",maqNum:36,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e465",lote:"—",maqNum:36,fecha:"2026-01-15",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e466",lote:"—",maqNum:37,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e467",lote:"—",maqNum:37,fecha:"2026-01-15",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e468",lote:"—",maqNum:38,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e469",lote:"—",maqNum:38,fecha:"2026-01-15",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:17,talles:{"42":0,"44":0,"46":0,"48":17,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e470",lote:"—",maqNum:40,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:63,talles:{"42":0,"44":0,"46":0,"48":63,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e471",lote:"—",maqNum:40,fecha:"2026-01-15",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e472",lote:"—",maqNum:41,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:63,talles:{"42":0,"44":0,"46":0,"48":63,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e473",lote:"—",maqNum:41,fecha:"2026-01-15",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e474",lote:"—",maqNum:42,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:78,talles:{"42":0,"44":0,"46":0,"48":78,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e475",lote:"—",maqNum:42,fecha:"2026-01-15",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e476",lote:"—",maqNum:43,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e477",lote:"—",maqNum:43,fecha:"2026-01-15",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:82,talles:{"42":0,"44":0,"46":0,"48":82,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e478",lote:"—",maqNum:45,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e479",lote:"—",maqNum:45,fecha:"2026-01-15",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e480",lote:"—",maqNum:50,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e481",lote:"—",maqNum:51,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e482",lote:"—",maqNum:55,fecha:"2026-01-15",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e483",lote:"—",maqNum:1,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e484",lote:"—",maqNum:1,fecha:"2026-01-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:51,talles:{"42":0,"44":0,"46":0,"48":51,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e485",lote:"—",maqNum:5,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:96,talles:{"42":0,"44":0,"46":0,"48":96,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e486",lote:"—",maqNum:5,fecha:"2026-01-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:120,talles:{"42":0,"44":0,"46":0,"48":120,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e487",lote:"—",maqNum:6,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:116,talles:{"42":0,"44":0,"46":0,"48":116,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e488",lote:"—",maqNum:6,fecha:"2026-01-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:112,talles:{"42":0,"44":0,"46":0,"48":112,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e489",lote:"—",maqNum:10,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e490",lote:"—",maqNum:11,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e491",lote:"—",maqNum:12,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e492",lote:"—",maqNum:13,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:58,talles:{"42":0,"44":0,"46":0,"48":58,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e493",lote:"—",maqNum:20,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e494",lote:"—",maqNum:20,fecha:"2026-01-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e495",lote:"—",maqNum:21,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:59,talles:{"42":0,"44":0,"46":0,"48":59,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e496",lote:"—",maqNum:21,fecha:"2026-01-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e497",lote:"—",maqNum:22,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e498",lote:"—",maqNum:22,fecha:"2026-01-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e499",lote:"—",maqNum:23,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e500",lote:"—",maqNum:23,fecha:"2026-01-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e501",lote:"—",maqNum:24,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:51,talles:{"42":0,"44":0,"46":0,"48":51,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e502",lote:"—",maqNum:24,fecha:"2026-01-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e503",lote:"—",maqNum:25,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e504",lote:"—",maqNum:25,fecha:"2026-01-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:53,talles:{"42":0,"44":0,"46":0,"48":53,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e505",lote:"—",maqNum:3,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e506",lote:"—",maqNum:30,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e507",lote:"—",maqNum:30,fecha:"2026-01-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e508",lote:"—",maqNum:31,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e509",lote:"—",maqNum:31,fecha:"2026-01-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e510",lote:"—",maqNum:32,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e511",lote:"—",maqNum:32,fecha:"2026-01-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:21,talles:{"42":0,"44":0,"46":0,"48":21,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e512",lote:"—",maqNum:33,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e513",lote:"—",maqNum:33,fecha:"2026-01-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e514",lote:"—",maqNum:34,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e515",lote:"—",maqNum:34,fecha:"2026-01-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e516",lote:"—",maqNum:35,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e517",lote:"—",maqNum:35,fecha:"2026-01-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e518",lote:"—",maqNum:36,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:18,talles:{"42":0,"44":0,"46":0,"48":18,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e519",lote:"—",maqNum:36,fecha:"2026-01-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e520",lote:"—",maqNum:37,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e521",lote:"—",maqNum:37,fecha:"2026-01-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:17,talles:{"42":0,"44":0,"46":0,"48":17,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e522",lote:"—",maqNum:38,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e523",lote:"—",maqNum:38,fecha:"2026-01-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e524",lote:"—",maqNum:40,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:61,talles:{"42":0,"44":0,"46":0,"48":61,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e525",lote:"—",maqNum:41,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e526",lote:"—",maqNum:42,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:86,talles:{"42":0,"44":0,"46":0,"48":86,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e527",lote:"—",maqNum:43,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:124,talles:{"42":0,"44":0,"46":0,"48":124,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e528",lote:"—",maqNum:45,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e529",lote:"—",maqNum:50,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:12,talles:{"42":0,"44":0,"46":0,"48":12,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e530",lote:"—",maqNum:51,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e531",lote:"—",maqNum:55,fecha:"2026-01-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e532",lote:"—",maqNum:1,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e533",lote:"—",maqNum:1,fecha:"2026-01-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e534",lote:"—",maqNum:4,fecha:"2026-01-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e535",lote:"—",maqNum:5,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:112,talles:{"42":0,"44":0,"46":0,"48":112,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e536",lote:"—",maqNum:5,fecha:"2026-01-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:120,talles:{"42":0,"44":0,"46":0,"48":120,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e537",lote:"—",maqNum:6,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:80,talles:{"42":0,"44":0,"46":0,"48":80,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e538",lote:"—",maqNum:6,fecha:"2026-01-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:112,talles:{"42":0,"44":0,"46":0,"48":112,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e539",lote:"—",maqNum:10,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e540",lote:"—",maqNum:11,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:86,talles:{"42":0,"44":0,"46":0,"48":86,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e541",lote:"—",maqNum:12,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:64,talles:{"42":0,"44":0,"46":0,"48":64,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e542",lote:"—",maqNum:13,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e543",lote:"—",maqNum:20,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e544",lote:"—",maqNum:20,fecha:"2026-01-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e545",lote:"—",maqNum:21,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:55,talles:{"42":0,"44":0,"46":0,"48":55,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e546",lote:"—",maqNum:21,fecha:"2026-01-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e547",lote:"—",maqNum:22,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e548",lote:"—",maqNum:22,fecha:"2026-01-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e549",lote:"—",maqNum:23,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e550",lote:"—",maqNum:23,fecha:"2026-01-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e551",lote:"—",maqNum:24,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e552",lote:"—",maqNum:24,fecha:"2026-01-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:55,talles:{"42":0,"44":0,"46":0,"48":55,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e553",lote:"—",maqNum:25,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e554",lote:"—",maqNum:25,fecha:"2026-01-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e555",lote:"—",maqNum:3,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e556",lote:"—",maqNum:3,fecha:"2026-01-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e557",lote:"—",maqNum:30,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e558",lote:"—",maqNum:30,fecha:"2026-01-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e559",lote:"—",maqNum:31,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e560",lote:"—",maqNum:31,fecha:"2026-01-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e561",lote:"—",maqNum:32,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:19,talles:{"42":0,"44":0,"46":0,"48":19,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e562",lote:"—",maqNum:32,fecha:"2026-01-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e563",lote:"—",maqNum:33,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:19,talles:{"42":0,"44":0,"46":0,"48":19,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e564",lote:"—",maqNum:33,fecha:"2026-01-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e565",lote:"—",maqNum:34,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e566",lote:"—",maqNum:34,fecha:"2026-01-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e567",lote:"—",maqNum:35,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e568",lote:"—",maqNum:35,fecha:"2026-01-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e569",lote:"—",maqNum:36,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e570",lote:"—",maqNum:36,fecha:"2026-01-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e571",lote:"—",maqNum:37,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e572",lote:"—",maqNum:37,fecha:"2026-01-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e573",lote:"—",maqNum:38,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e574",lote:"—",maqNum:38,fecha:"2026-01-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e575",lote:"—",maqNum:40,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:82,talles:{"42":0,"44":0,"46":0,"48":82,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e576",lote:"—",maqNum:40,fecha:"2026-01-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:84,talles:{"42":0,"44":0,"46":0,"48":84,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e577",lote:"—",maqNum:41,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e578",lote:"—",maqNum:41,fecha:"2026-01-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e579",lote:"—",maqNum:42,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e580",lote:"—",maqNum:42,fecha:"2026-01-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:106,talles:{"42":0,"44":0,"46":0,"48":106,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e581",lote:"—",maqNum:43,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e582",lote:"—",maqNum:43,fecha:"2026-01-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e583",lote:"—",maqNum:45,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:11,talles:{"42":0,"44":0,"46":0,"48":11,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e584",lote:"—",maqNum:45,fecha:"2026-01-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e585",lote:"—",maqNum:50,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e586",lote:"—",maqNum:51,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e587",lote:"—",maqNum:55,fecha:"2026-01-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e588",lote:"—",maqNum:1,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:49,talles:{"42":0,"44":0,"46":0,"48":49,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e589",lote:"—",maqNum:1,fecha:"2026-01-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:51,talles:{"42":0,"44":0,"46":0,"48":51,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e590",lote:"—",maqNum:4,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e591",lote:"—",maqNum:4,fecha:"2026-01-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e592",lote:"—",maqNum:5,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:130,talles:{"42":0,"44":0,"46":0,"48":130,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e593",lote:"—",maqNum:5,fecha:"2026-01-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:128,talles:{"42":0,"44":0,"46":0,"48":128,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e594",lote:"—",maqNum:6,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:86,talles:{"42":0,"44":0,"46":0,"48":86,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e595",lote:"—",maqNum:6,fecha:"2026-01-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:134,talles:{"42":0,"44":0,"46":0,"48":134,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e596",lote:"—",maqNum:10,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e597",lote:"—",maqNum:11,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e598",lote:"—",maqNum:12,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e599",lote:"—",maqNum:13,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e600",lote:"—",maqNum:20,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e601",lote:"—",maqNum:20,fecha:"2026-01-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e602",lote:"—",maqNum:21,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:63,talles:{"42":0,"44":0,"46":0,"48":63,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e603",lote:"—",maqNum:21,fecha:"2026-01-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e604",lote:"—",maqNum:22,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e605",lote:"—",maqNum:22,fecha:"2026-01-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e606",lote:"—",maqNum:23,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e607",lote:"—",maqNum:23,fecha:"2026-01-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e608",lote:"—",maqNum:24,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e609",lote:"—",maqNum:24,fecha:"2026-01-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e610",lote:"—",maqNum:25,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e611",lote:"—",maqNum:25,fecha:"2026-01-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e612",lote:"—",maqNum:3,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e613",lote:"—",maqNum:3,fecha:"2026-01-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e614",lote:"—",maqNum:30,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e615",lote:"—",maqNum:30,fecha:"2026-01-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e616",lote:"—",maqNum:31,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e617",lote:"—",maqNum:31,fecha:"2026-01-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e618",lote:"—",maqNum:32,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:18,talles:{"42":0,"44":0,"46":0,"48":18,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e619",lote:"—",maqNum:32,fecha:"2026-01-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e620",lote:"—",maqNum:33,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e621",lote:"—",maqNum:33,fecha:"2026-01-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e622",lote:"—",maqNum:34,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e623",lote:"—",maqNum:34,fecha:"2026-01-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e624",lote:"—",maqNum:35,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e625",lote:"—",maqNum:35,fecha:"2026-01-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e626",lote:"—",maqNum:36,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e627",lote:"—",maqNum:36,fecha:"2026-01-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e628",lote:"—",maqNum:37,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e629",lote:"—",maqNum:37,fecha:"2026-01-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e630",lote:"—",maqNum:38,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e631",lote:"—",maqNum:38,fecha:"2026-01-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e632",lote:"—",maqNum:40,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:95,talles:{"42":0,"44":0,"46":0,"48":95,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e633",lote:"—",maqNum:40,fecha:"2026-01-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e634",lote:"—",maqNum:41,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e635",lote:"—",maqNum:41,fecha:"2026-01-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e636",lote:"—",maqNum:42,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e637",lote:"—",maqNum:42,fecha:"2026-01-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:102,talles:{"42":0,"44":0,"46":0,"48":102,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e638",lote:"—",maqNum:43,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e639",lote:"—",maqNum:43,fecha:"2026-01-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e640",lote:"—",maqNum:45,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e641",lote:"—",maqNum:45,fecha:"2026-01-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e642",lote:"—",maqNum:50,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e643",lote:"—",maqNum:51,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e644",lote:"—",maqNum:55,fecha:"2026-01-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:21,talles:{"42":0,"44":0,"46":0,"48":21,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e645",lote:"—",maqNum:1,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:53,talles:{"42":0,"44":0,"46":0,"48":53,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e646",lote:"—",maqNum:1,fecha:"2026-01-21",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e647",lote:"—",maqNum:4,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e648",lote:"—",maqNum:4,fecha:"2026-01-21",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e649",lote:"—",maqNum:5,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:80,talles:{"42":0,"44":0,"46":0,"48":80,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e650",lote:"—",maqNum:5,fecha:"2026-01-21",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:120,talles:{"42":0,"44":0,"46":0,"48":120,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e651",lote:"—",maqNum:6,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e652",lote:"—",maqNum:6,fecha:"2026-01-21",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:118,talles:{"42":0,"44":0,"46":0,"48":118,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e653",lote:"—",maqNum:10,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e654",lote:"—",maqNum:11,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e655",lote:"—",maqNum:12,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:100,talles:{"42":0,"44":0,"46":0,"48":100,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e656",lote:"—",maqNum:13,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e657",lote:"—",maqNum:20,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e658",lote:"—",maqNum:20,fecha:"2026-01-21",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e659",lote:"—",maqNum:21,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e660",lote:"—",maqNum:21,fecha:"2026-01-21",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e661",lote:"—",maqNum:22,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e662",lote:"—",maqNum:22,fecha:"2026-01-21",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e663",lote:"—",maqNum:23,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e664",lote:"—",maqNum:23,fecha:"2026-01-21",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e665",lote:"—",maqNum:24,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:63,talles:{"42":0,"44":0,"46":0,"48":63,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e666",lote:"—",maqNum:24,fecha:"2026-01-21",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:55,talles:{"42":0,"44":0,"46":0,"48":55,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e667",lote:"—",maqNum:25,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:67,talles:{"42":0,"44":0,"46":0,"48":67,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e668",lote:"—",maqNum:25,fecha:"2026-01-21",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e669",lote:"—",maqNum:3,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e670",lote:"—",maqNum:3,fecha:"2026-01-21",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e671",lote:"—",maqNum:30,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e672",lote:"—",maqNum:30,fecha:"2026-01-21",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e673",lote:"—",maqNum:31,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e674",lote:"—",maqNum:31,fecha:"2026-01-21",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e675",lote:"—",maqNum:32,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e676",lote:"—",maqNum:32,fecha:"2026-01-21",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e677",lote:"—",maqNum:33,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e678",lote:"—",maqNum:33,fecha:"2026-01-21",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e679",lote:"—",maqNum:34,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e680",lote:"—",maqNum:34,fecha:"2026-01-21",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e681",lote:"—",maqNum:35,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e682",lote:"—",maqNum:35,fecha:"2026-01-21",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e683",lote:"—",maqNum:36,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e684",lote:"—",maqNum:36,fecha:"2026-01-21",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e685",lote:"—",maqNum:37,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e686",lote:"—",maqNum:37,fecha:"2026-01-21",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e687",lote:"—",maqNum:38,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e688",lote:"—",maqNum:38,fecha:"2026-01-21",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e689",lote:"—",maqNum:40,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e690",lote:"—",maqNum:40,fecha:"2026-01-21",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:57,talles:{"42":0,"44":0,"46":0,"48":57,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e691",lote:"—",maqNum:41,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e692",lote:"—",maqNum:41,fecha:"2026-01-21",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e693",lote:"—",maqNum:42,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:118,talles:{"42":0,"44":0,"46":0,"48":118,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e694",lote:"—",maqNum:42,fecha:"2026-01-21",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:82,talles:{"42":0,"44":0,"46":0,"48":82,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e695",lote:"—",maqNum:43,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e696",lote:"—",maqNum:43,fecha:"2026-01-21",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e697",lote:"—",maqNum:45,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e698",lote:"—",maqNum:45,fecha:"2026-01-21",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e699",lote:"—",maqNum:50,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e700",lote:"—",maqNum:51,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e701",lote:"—",maqNum:55,fecha:"2026-01-21",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e702",lote:"—",maqNum:1,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e703",lote:"—",maqNum:1,fecha:"2026-01-22",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e704",lote:"—",maqNum:4,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e705",lote:"—",maqNum:4,fecha:"2026-01-22",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e706",lote:"—",maqNum:5,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:86,talles:{"42":0,"44":0,"46":0,"48":86,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e707",lote:"—",maqNum:5,fecha:"2026-01-22",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:112,talles:{"42":0,"44":0,"46":0,"48":112,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e708",lote:"—",maqNum:6,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:138,talles:{"42":0,"44":0,"46":0,"48":138,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e709",lote:"—",maqNum:6,fecha:"2026-01-22",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:114,talles:{"42":0,"44":0,"46":0,"48":114,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e710",lote:"—",maqNum:10,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e711",lote:"—",maqNum:11,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e712",lote:"—",maqNum:12,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e713",lote:"—",maqNum:13,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e714",lote:"—",maqNum:20,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e715",lote:"—",maqNum:20,fecha:"2026-01-22",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e716",lote:"—",maqNum:21,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e717",lote:"—",maqNum:21,fecha:"2026-01-22",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e718",lote:"—",maqNum:22,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e719",lote:"—",maqNum:22,fecha:"2026-01-22",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e720",lote:"—",maqNum:23,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e721",lote:"—",maqNum:23,fecha:"2026-01-22",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e722",lote:"—",maqNum:24,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:51,talles:{"42":0,"44":0,"46":0,"48":51,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e723",lote:"—",maqNum:24,fecha:"2026-01-22",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:49,talles:{"42":0,"44":0,"46":0,"48":49,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e724",lote:"—",maqNum:25,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e725",lote:"—",maqNum:25,fecha:"2026-01-22",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e726",lote:"—",maqNum:3,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e727",lote:"—",maqNum:3,fecha:"2026-01-22",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e728",lote:"—",maqNum:30,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e729",lote:"—",maqNum:30,fecha:"2026-01-22",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e730",lote:"—",maqNum:31,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e731",lote:"—",maqNum:31,fecha:"2026-01-22",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e732",lote:"—",maqNum:32,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e733",lote:"—",maqNum:32,fecha:"2026-01-22",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e734",lote:"—",maqNum:33,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e735",lote:"—",maqNum:33,fecha:"2026-01-22",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e736",lote:"—",maqNum:34,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e737",lote:"—",maqNum:34,fecha:"2026-01-22",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e738",lote:"—",maqNum:35,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e739",lote:"—",maqNum:35,fecha:"2026-01-22",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e740",lote:"—",maqNum:36,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e741",lote:"—",maqNum:36,fecha:"2026-01-22",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e742",lote:"—",maqNum:37,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e743",lote:"—",maqNum:37,fecha:"2026-01-22",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e744",lote:"—",maqNum:38,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e745",lote:"—",maqNum:38,fecha:"2026-01-22",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e746",lote:"—",maqNum:40,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e747",lote:"—",maqNum:40,fecha:"2026-01-22",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e748",lote:"—",maqNum:41,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e749",lote:"—",maqNum:41,fecha:"2026-01-22",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e750",lote:"—",maqNum:42,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:77,talles:{"42":0,"44":0,"46":0,"48":77,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e751",lote:"—",maqNum:42,fecha:"2026-01-22",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:77,talles:{"42":0,"44":0,"46":0,"48":77,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e752",lote:"—",maqNum:43,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e753",lote:"—",maqNum:43,fecha:"2026-01-22",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:64,talles:{"42":0,"44":0,"46":0,"48":64,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e754",lote:"—",maqNum:45,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e755",lote:"—",maqNum:45,fecha:"2026-01-22",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e756",lote:"—",maqNum:50,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e757",lote:"—",maqNum:51,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e758",lote:"—",maqNum:55,fecha:"2026-01-22",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e759",lote:"—",maqNum:1,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:51,talles:{"42":0,"44":0,"46":0,"48":51,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e760",lote:"—",maqNum:1,fecha:"2026-01-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e761",lote:"—",maqNum:4,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e762",lote:"—",maqNum:4,fecha:"2026-01-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e763",lote:"—",maqNum:5,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e764",lote:"—",maqNum:5,fecha:"2026-01-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:114,talles:{"42":0,"44":0,"46":0,"48":114,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e765",lote:"—",maqNum:6,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:130,talles:{"42":0,"44":0,"46":0,"48":130,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e766",lote:"—",maqNum:6,fecha:"2026-01-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:130,talles:{"42":0,"44":0,"46":0,"48":130,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e767",lote:"—",maqNum:10,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e768",lote:"—",maqNum:11,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e769",lote:"—",maqNum:12,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e770",lote:"—",maqNum:13,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e771",lote:"—",maqNum:20,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e772",lote:"—",maqNum:20,fecha:"2026-01-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e773",lote:"—",maqNum:21,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:76,talles:{"42":0,"44":0,"46":0,"48":76,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e774",lote:"—",maqNum:21,fecha:"2026-01-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e775",lote:"—",maqNum:22,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e776",lote:"—",maqNum:22,fecha:"2026-01-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e777",lote:"—",maqNum:23,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e778",lote:"—",maqNum:23,fecha:"2026-01-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:19,talles:{"42":0,"44":0,"46":0,"48":19,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e779",lote:"—",maqNum:24,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e780",lote:"—",maqNum:24,fecha:"2026-01-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e781",lote:"—",maqNum:25,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e782",lote:"—",maqNum:25,fecha:"2026-01-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e783",lote:"—",maqNum:3,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e784",lote:"—",maqNum:3,fecha:"2026-01-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:79,talles:{"42":0,"44":0,"46":0,"48":79,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e785",lote:"—",maqNum:30,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e786",lote:"—",maqNum:30,fecha:"2026-01-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e787",lote:"—",maqNum:31,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e788",lote:"—",maqNum:31,fecha:"2026-01-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e789",lote:"—",maqNum:32,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e790",lote:"—",maqNum:32,fecha:"2026-01-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e791",lote:"—",maqNum:33,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e792",lote:"—",maqNum:33,fecha:"2026-01-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e793",lote:"—",maqNum:34,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e794",lote:"—",maqNum:34,fecha:"2026-01-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e795",lote:"—",maqNum:35,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e796",lote:"—",maqNum:35,fecha:"2026-01-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e797",lote:"—",maqNum:36,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e798",lote:"—",maqNum:36,fecha:"2026-01-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e799",lote:"—",maqNum:37,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e800",lote:"—",maqNum:37,fecha:"2026-01-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e801",lote:"—",maqNum:38,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e802",lote:"—",maqNum:38,fecha:"2026-01-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e803",lote:"—",maqNum:40,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:59,talles:{"42":0,"44":0,"46":0,"48":59,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e804",lote:"—",maqNum:40,fecha:"2026-01-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:76,talles:{"42":0,"44":0,"46":0,"48":76,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e805",lote:"—",maqNum:41,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e806",lote:"—",maqNum:41,fecha:"2026-01-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e807",lote:"—",maqNum:42,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:86,talles:{"42":0,"44":0,"46":0,"48":86,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e808",lote:"—",maqNum:42,fecha:"2026-01-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:130,talles:{"42":0,"44":0,"46":0,"48":130,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e809",lote:"—",maqNum:43,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e810",lote:"—",maqNum:43,fecha:"2026-01-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e811",lote:"—",maqNum:45,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e812",lote:"—",maqNum:50,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e813",lote:"—",maqNum:51,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e814",lote:"—",maqNum:55,fecha:"2026-01-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e815",lote:"—",maqNum:1,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e816",lote:"—",maqNum:1,fecha:"2026-01-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e817",lote:"—",maqNum:4,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e818",lote:"—",maqNum:4,fecha:"2026-01-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e819",lote:"—",maqNum:5,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:82,talles:{"42":0,"44":0,"46":0,"48":82,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e820",lote:"—",maqNum:5,fecha:"2026-01-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:124,talles:{"42":0,"44":0,"46":0,"48":124,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e821",lote:"—",maqNum:6,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:6,talles:{"42":0,"44":0,"46":0,"48":6,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e822",lote:"—",maqNum:10,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e823",lote:"—",maqNum:11,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e824",lote:"—",maqNum:12,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e825",lote:"—",maqNum:13,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e826",lote:"—",maqNum:20,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e827",lote:"—",maqNum:20,fecha:"2026-01-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e828",lote:"—",maqNum:21,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:63,talles:{"42":0,"44":0,"46":0,"48":63,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e829",lote:"—",maqNum:21,fecha:"2026-01-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:59,talles:{"42":0,"44":0,"46":0,"48":59,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e830",lote:"—",maqNum:22,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e831",lote:"—",maqNum:22,fecha:"2026-01-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e832",lote:"—",maqNum:23,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e833",lote:"—",maqNum:23,fecha:"2026-01-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e834",lote:"—",maqNum:24,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e835",lote:"—",maqNum:24,fecha:"2026-01-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e836",lote:"—",maqNum:25,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:59,talles:{"42":0,"44":0,"46":0,"48":59,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e837",lote:"—",maqNum:25,fecha:"2026-01-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:55,talles:{"42":0,"44":0,"46":0,"48":55,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e838",lote:"—",maqNum:3,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:63,talles:{"42":0,"44":0,"46":0,"48":63,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e839",lote:"—",maqNum:3,fecha:"2026-01-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:49,talles:{"42":0,"44":0,"46":0,"48":49,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e840",lote:"—",maqNum:30,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e841",lote:"—",maqNum:30,fecha:"2026-01-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e842",lote:"—",maqNum:31,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e843",lote:"—",maqNum:31,fecha:"2026-01-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e844",lote:"—",maqNum:32,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e845",lote:"—",maqNum:32,fecha:"2026-01-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e846",lote:"—",maqNum:33,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e847",lote:"—",maqNum:33,fecha:"2026-01-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e848",lote:"—",maqNum:34,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e849",lote:"—",maqNum:34,fecha:"2026-01-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e850",lote:"—",maqNum:35,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e851",lote:"—",maqNum:35,fecha:"2026-01-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e852",lote:"—",maqNum:36,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e853",lote:"—",maqNum:36,fecha:"2026-01-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e854",lote:"—",maqNum:37,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e855",lote:"—",maqNum:37,fecha:"2026-01-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e856",lote:"—",maqNum:38,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e857",lote:"—",maqNum:38,fecha:"2026-01-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e858",lote:"—",maqNum:40,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:77,talles:{"42":0,"44":0,"46":0,"48":77,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e859",lote:"—",maqNum:40,fecha:"2026-01-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e860",lote:"—",maqNum:41,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e861",lote:"—",maqNum:41,fecha:"2026-01-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:58,talles:{"42":0,"44":0,"46":0,"48":58,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e862",lote:"—",maqNum:42,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:98,talles:{"42":0,"44":0,"46":0,"48":98,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e863",lote:"—",maqNum:42,fecha:"2026-01-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:64,talles:{"42":0,"44":0,"46":0,"48":64,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e864",lote:"—",maqNum:43,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e865",lote:"—",maqNum:50,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e866",lote:"—",maqNum:51,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e867",lote:"—",maqNum:55,fecha:"2026-01-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e868",lote:"—",maqNum:1,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e869",lote:"—",maqNum:4,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e870",lote:"—",maqNum:5,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e871",lote:"—",maqNum:6,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e872",lote:"—",maqNum:10,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:8,talles:{"42":0,"44":0,"46":0,"48":8,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e873",lote:"—",maqNum:10,fecha:"2026-01-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:7,talles:{"42":0,"44":0,"46":0,"48":7,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e874",lote:"—",maqNum:11,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e875",lote:"—",maqNum:11,fecha:"2026-01-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:74,talles:{"42":0,"44":0,"46":0,"48":74,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e876",lote:"—",maqNum:12,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:74,talles:{"42":0,"44":0,"46":0,"48":74,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e877",lote:"—",maqNum:12,fecha:"2026-01-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e878",lote:"—",maqNum:13,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e879",lote:"—",maqNum:13,fecha:"2026-01-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e880",lote:"—",maqNum:20,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e881",lote:"—",maqNum:20,fecha:"2026-01-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e882",lote:"—",maqNum:21,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:63,talles:{"42":0,"44":0,"46":0,"48":63,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e883",lote:"—",maqNum:21,fecha:"2026-01-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:55,talles:{"42":0,"44":0,"46":0,"48":55,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e884",lote:"—",maqNum:22,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e885",lote:"—",maqNum:22,fecha:"2026-01-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e886",lote:"—",maqNum:23,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e887",lote:"—",maqNum:23,fecha:"2026-01-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e888",lote:"—",maqNum:24,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:58,talles:{"42":0,"44":0,"46":0,"48":58,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e889",lote:"—",maqNum:24,fecha:"2026-01-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e890",lote:"—",maqNum:25,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:71,talles:{"42":0,"44":0,"46":0,"48":71,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e891",lote:"—",maqNum:25,fecha:"2026-01-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e892",lote:"—",maqNum:3,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e893",lote:"—",maqNum:30,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e894",lote:"—",maqNum:30,fecha:"2026-01-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e895",lote:"—",maqNum:31,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e896",lote:"—",maqNum:31,fecha:"2026-01-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e897",lote:"—",maqNum:32,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e898",lote:"—",maqNum:32,fecha:"2026-01-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e899",lote:"—",maqNum:33,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e900",lote:"—",maqNum:33,fecha:"2026-01-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e901",lote:"—",maqNum:34,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e902",lote:"—",maqNum:34,fecha:"2026-01-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e903",lote:"—",maqNum:35,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e904",lote:"—",maqNum:35,fecha:"2026-01-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e905",lote:"—",maqNum:36,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e906",lote:"—",maqNum:36,fecha:"2026-01-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e907",lote:"—",maqNum:37,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e908",lote:"—",maqNum:37,fecha:"2026-01-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e909",lote:"—",maqNum:38,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e910",lote:"—",maqNum:38,fecha:"2026-01-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e911",lote:"—",maqNum:40,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e912",lote:"—",maqNum:41,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:67,talles:{"42":0,"44":0,"46":0,"48":67,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e913",lote:"—",maqNum:42,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:86,talles:{"42":0,"44":0,"46":0,"48":86,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e914",lote:"—",maqNum:50,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e915",lote:"—",maqNum:51,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e916",lote:"—",maqNum:55,fecha:"2026-01-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e917",lote:"—",maqNum:1,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e918",lote:"—",maqNum:4,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e919",lote:"—",maqNum:5,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:88,talles:{"42":0,"44":0,"46":0,"48":88,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e920",lote:"—",maqNum:6,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e921",lote:"—",maqNum:10,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e922",lote:"—",maqNum:10,fecha:"2026-01-28",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:18,talles:{"42":0,"44":0,"46":0,"48":18,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e923",lote:"—",maqNum:11,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:78,talles:{"42":0,"44":0,"46":0,"48":78,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e924",lote:"—",maqNum:11,fecha:"2026-01-28",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e925",lote:"—",maqNum:12,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e926",lote:"—",maqNum:12,fecha:"2026-01-28",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e927",lote:"—",maqNum:13,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e928",lote:"—",maqNum:13,fecha:"2026-01-28",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e929",lote:"—",maqNum:20,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e930",lote:"—",maqNum:21,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e931",lote:"—",maqNum:21,fecha:"2026-01-28",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:57,talles:{"42":0,"44":0,"46":0,"48":57,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e932",lote:"—",maqNum:22,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:53,talles:{"42":0,"44":0,"46":0,"48":53,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e933",lote:"—",maqNum:22,fecha:"2026-01-28",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e934",lote:"—",maqNum:23,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e935",lote:"—",maqNum:23,fecha:"2026-01-28",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e936",lote:"—",maqNum:24,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:67,talles:{"42":0,"44":0,"46":0,"48":67,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e937",lote:"—",maqNum:24,fecha:"2026-01-28",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e938",lote:"—",maqNum:25,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:63,talles:{"42":0,"44":0,"46":0,"48":63,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e939",lote:"—",maqNum:25,fecha:"2026-01-28",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:51,talles:{"42":0,"44":0,"46":0,"48":51,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e940",lote:"—",maqNum:3,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e941",lote:"—",maqNum:3,fecha:"2026-01-28",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e942",lote:"—",maqNum:30,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e943",lote:"—",maqNum:30,fecha:"2026-01-28",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e944",lote:"—",maqNum:31,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e945",lote:"—",maqNum:31,fecha:"2026-01-28",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e946",lote:"—",maqNum:32,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e947",lote:"—",maqNum:32,fecha:"2026-01-28",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e948",lote:"—",maqNum:33,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e949",lote:"—",maqNum:33,fecha:"2026-01-28",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e950",lote:"—",maqNum:34,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e951",lote:"—",maqNum:34,fecha:"2026-01-28",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e952",lote:"—",maqNum:35,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e953",lote:"—",maqNum:35,fecha:"2026-01-28",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e954",lote:"—",maqNum:36,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e955",lote:"—",maqNum:36,fecha:"2026-01-28",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e956",lote:"—",maqNum:37,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e957",lote:"—",maqNum:37,fecha:"2026-01-28",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e958",lote:"—",maqNum:38,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e959",lote:"—",maqNum:38,fecha:"2026-01-28",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:53,talles:{"42":0,"44":0,"46":0,"48":53,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e960",lote:"—",maqNum:40,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e961",lote:"—",maqNum:40,fecha:"2026-01-28",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:57,talles:{"42":0,"44":0,"46":0,"48":57,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e962",lote:"—",maqNum:41,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:71,talles:{"42":0,"44":0,"46":0,"48":71,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e963",lote:"—",maqNum:41,fecha:"2026-01-28",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e964",lote:"—",maqNum:42,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e965",lote:"—",maqNum:42,fecha:"2026-01-28",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e966",lote:"—",maqNum:43,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e967",lote:"—",maqNum:43,fecha:"2026-01-28",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:78,talles:{"42":0,"44":0,"46":0,"48":78,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e968",lote:"—",maqNum:45,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:21,talles:{"42":0,"44":0,"46":0,"48":21,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e969",lote:"—",maqNum:45,fecha:"2026-01-28",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:17,talles:{"42":0,"44":0,"46":0,"48":17,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e970",lote:"—",maqNum:50,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e971",lote:"—",maqNum:51,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e972",lote:"—",maqNum:55,fecha:"2026-01-28",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e973",lote:"—",maqNum:1,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e974",lote:"—",maqNum:4,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:53,talles:{"42":0,"44":0,"46":0,"48":53,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e975",lote:"—",maqNum:5,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:120,talles:{"42":0,"44":0,"46":0,"48":120,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e976",lote:"—",maqNum:10,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e977",lote:"—",maqNum:10,fecha:"2026-01-29",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:17,talles:{"42":0,"44":0,"46":0,"48":17,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e978",lote:"—",maqNum:11,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e979",lote:"—",maqNum:11,fecha:"2026-01-29",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:74,talles:{"42":0,"44":0,"46":0,"48":74,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e980",lote:"—",maqNum:12,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e981",lote:"—",maqNum:12,fecha:"2026-01-29",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:74,talles:{"42":0,"44":0,"46":0,"48":74,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e982",lote:"—",maqNum:13,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:76,talles:{"42":0,"44":0,"46":0,"48":76,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e983",lote:"—",maqNum:13,fecha:"2026-01-29",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e984",lote:"—",maqNum:20,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e985",lote:"—",maqNum:20,fecha:"2026-01-29",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e986",lote:"—",maqNum:21,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:63,talles:{"42":0,"44":0,"46":0,"48":63,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e987",lote:"—",maqNum:21,fecha:"2026-01-29",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:53,talles:{"42":0,"44":0,"46":0,"48":53,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e988",lote:"—",maqNum:22,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e989",lote:"—",maqNum:22,fecha:"2026-01-29",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e990",lote:"—",maqNum:23,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e991",lote:"—",maqNum:23,fecha:"2026-01-29",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e992",lote:"—",maqNum:24,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e993",lote:"—",maqNum:24,fecha:"2026-01-29",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e994",lote:"—",maqNum:25,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e995",lote:"—",maqNum:25,fecha:"2026-01-29",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:49,talles:{"42":0,"44":0,"46":0,"48":49,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e996",lote:"—",maqNum:3,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e997",lote:"—",maqNum:3,fecha:"2026-01-29",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:81,talles:{"42":0,"44":0,"46":0,"48":81,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e998",lote:"—",maqNum:30,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e999",lote:"—",maqNum:30,fecha:"2026-01-29",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:19,talles:{"42":0,"44":0,"46":0,"48":19,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1000",lote:"—",maqNum:31,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1001",lote:"—",maqNum:31,fecha:"2026-01-29",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1002",lote:"—",maqNum:32,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1003",lote:"—",maqNum:32,fecha:"2026-01-29",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1004",lote:"—",maqNum:33,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1005",lote:"—",maqNum:33,fecha:"2026-01-29",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1006",lote:"—",maqNum:34,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1007",lote:"—",maqNum:34,fecha:"2026-01-29",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1008",lote:"—",maqNum:35,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1009",lote:"—",maqNum:35,fecha:"2026-01-29",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1010",lote:"—",maqNum:36,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1011",lote:"—",maqNum:36,fecha:"2026-01-29",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1012",lote:"—",maqNum:37,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1013",lote:"—",maqNum:37,fecha:"2026-01-29",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1014",lote:"—",maqNum:38,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1015",lote:"—",maqNum:38,fecha:"2026-01-29",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1016",lote:"—",maqNum:40,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:89,talles:{"42":0,"44":0,"46":0,"48":89,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1017",lote:"—",maqNum:40,fecha:"2026-01-29",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:77,talles:{"42":0,"44":0,"46":0,"48":77,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1018",lote:"—",maqNum:41,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1019",lote:"—",maqNum:41,fecha:"2026-01-29",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1020",lote:"—",maqNum:42,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:78,talles:{"42":0,"44":0,"46":0,"48":78,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1021",lote:"—",maqNum:42,fecha:"2026-01-29",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:88,talles:{"42":0,"44":0,"46":0,"48":88,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1022",lote:"—",maqNum:43,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:84,talles:{"42":0,"44":0,"46":0,"48":84,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1023",lote:"—",maqNum:43,fecha:"2026-01-29",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:64,talles:{"42":0,"44":0,"46":0,"48":64,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1024",lote:"—",maqNum:45,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1025",lote:"—",maqNum:45,fecha:"2026-01-29",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1026",lote:"—",maqNum:50,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1027",lote:"—",maqNum:51,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1028",lote:"—",maqNum:55,fecha:"2026-01-29",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1029",lote:"—",maqNum:1,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1030",lote:"—",maqNum:4,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1031",lote:"—",maqNum:5,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:118,talles:{"42":0,"44":0,"46":0,"48":118,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1032",lote:"—",maqNum:6,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1033",lote:"—",maqNum:10,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1034",lote:"—",maqNum:10,fecha:"2026-01-30",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1035",lote:"—",maqNum:11,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:71,talles:{"42":0,"44":0,"46":0,"48":71,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1036",lote:"—",maqNum:11,fecha:"2026-01-30",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1037",lote:"—",maqNum:12,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1038",lote:"—",maqNum:12,fecha:"2026-01-30",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:76,talles:{"42":0,"44":0,"46":0,"48":76,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1039",lote:"—",maqNum:13,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:64,talles:{"42":0,"44":0,"46":0,"48":64,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1040",lote:"—",maqNum:13,fecha:"2026-01-30",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1041",lote:"—",maqNum:20,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:57,talles:{"42":0,"44":0,"46":0,"48":57,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1042",lote:"—",maqNum:20,fecha:"2026-01-30",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1043",lote:"—",maqNum:21,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:65,talles:{"42":0,"44":0,"46":0,"48":65,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1044",lote:"—",maqNum:21,fecha:"2026-01-30",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1045",lote:"—",maqNum:22,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:61,talles:{"42":0,"44":0,"46":0,"48":61,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1046",lote:"—",maqNum:22,fecha:"2026-01-30",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1047",lote:"—",maqNum:23,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1048",lote:"—",maqNum:23,fecha:"2026-01-30",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1049",lote:"—",maqNum:24,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:67,talles:{"42":0,"44":0,"46":0,"48":67,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1050",lote:"—",maqNum:24,fecha:"2026-01-30",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1051",lote:"—",maqNum:25,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:59,talles:{"42":0,"44":0,"46":0,"48":59,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1052",lote:"—",maqNum:25,fecha:"2026-01-30",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:51,talles:{"42":0,"44":0,"46":0,"48":51,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1053",lote:"—",maqNum:3,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1054",lote:"—",maqNum:3,fecha:"2026-01-30",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1055",lote:"—",maqNum:30,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:21,talles:{"42":0,"44":0,"46":0,"48":21,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1056",lote:"—",maqNum:30,fecha:"2026-01-30",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1057",lote:"—",maqNum:31,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1058",lote:"—",maqNum:31,fecha:"2026-01-30",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1059",lote:"—",maqNum:32,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1060",lote:"—",maqNum:32,fecha:"2026-01-30",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1061",lote:"—",maqNum:33,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1062",lote:"—",maqNum:33,fecha:"2026-01-30",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1063",lote:"—",maqNum:34,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1064",lote:"—",maqNum:34,fecha:"2026-01-30",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1065",lote:"—",maqNum:35,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1066",lote:"—",maqNum:35,fecha:"2026-01-30",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1067",lote:"—",maqNum:36,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1068",lote:"—",maqNum:36,fecha:"2026-01-30",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1069",lote:"—",maqNum:37,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1070",lote:"—",maqNum:37,fecha:"2026-01-30",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1071",lote:"—",maqNum:38,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:21,talles:{"42":0,"44":0,"46":0,"48":21,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1072",lote:"—",maqNum:38,fecha:"2026-01-30",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:8,talles:{"42":0,"44":0,"46":0,"48":8,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1073",lote:"—",maqNum:40,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1074",lote:"—",maqNum:40,fecha:"2026-01-30",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1075",lote:"—",maqNum:41,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1076",lote:"—",maqNum:41,fecha:"2026-01-30",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1077",lote:"—",maqNum:42,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1078",lote:"—",maqNum:42,fecha:"2026-01-30",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:86,talles:{"42":0,"44":0,"46":0,"48":86,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1079",lote:"—",maqNum:43,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1080",lote:"—",maqNum:43,fecha:"2026-01-30",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:76,talles:{"42":0,"44":0,"46":0,"48":76,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1081",lote:"—",maqNum:45,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1082",lote:"—",maqNum:45,fecha:"2026-01-30",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1083",lote:"—",maqNum:50,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1084",lote:"—",maqNum:51,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"e1085",lote:"—",maqNum:55,fecha:"2026-01-30",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f0",lote:"—",maqNum:1,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:17,talles:{"42":0,"44":0,"46":0,"48":17,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f1",lote:"—",maqNum:5,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:138,talles:{"42":0,"44":0,"46":0,"48":138,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f2",lote:"—",maqNum:6,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:104,talles:{"42":0,"44":0,"46":0,"48":104,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f3",lote:"—",maqNum:10,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:8,talles:{"42":0,"44":0,"46":0,"48":8,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f4",lote:"—",maqNum:10,fecha:"2026-02-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:10,talles:{"42":0,"44":0,"46":0,"48":10,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f5",lote:"—",maqNum:11,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f6",lote:"—",maqNum:11,fecha:"2026-02-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:74,talles:{"42":0,"44":0,"46":0,"48":74,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f7",lote:"—",maqNum:12,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f8",lote:"—",maqNum:12,fecha:"2026-02-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:74,talles:{"42":0,"44":0,"46":0,"48":74,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f9",lote:"—",maqNum:13,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f10",lote:"—",maqNum:13,fecha:"2026-02-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f11",lote:"—",maqNum:20,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f12",lote:"—",maqNum:20,fecha:"2026-02-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f13",lote:"—",maqNum:21,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f14",lote:"—",maqNum:21,fecha:"2026-02-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:57,talles:{"42":0,"44":0,"46":0,"48":57,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f15",lote:"—",maqNum:22,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f16",lote:"—",maqNum:22,fecha:"2026-02-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:51,talles:{"42":0,"44":0,"46":0,"48":51,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f17",lote:"—",maqNum:23,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f18",lote:"—",maqNum:23,fecha:"2026-02-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f19",lote:"—",maqNum:24,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f20",lote:"—",maqNum:24,fecha:"2026-02-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:51,talles:{"42":0,"44":0,"46":0,"48":51,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f21",lote:"—",maqNum:25,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f22",lote:"—",maqNum:25,fecha:"2026-02-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f23",lote:"—",maqNum:3,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f24",lote:"—",maqNum:30,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f25",lote:"—",maqNum:30,fecha:"2026-02-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f26",lote:"—",maqNum:31,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f27",lote:"—",maqNum:31,fecha:"2026-02-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f28",lote:"—",maqNum:32,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f29",lote:"—",maqNum:32,fecha:"2026-02-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f30",lote:"—",maqNum:33,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:49,talles:{"42":0,"44":0,"46":0,"48":49,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f31",lote:"—",maqNum:33,fecha:"2026-02-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f32",lote:"—",maqNum:34,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f33",lote:"—",maqNum:34,fecha:"2026-02-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f34",lote:"—",maqNum:35,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f35",lote:"—",maqNum:35,fecha:"2026-02-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:49,talles:{"42":0,"44":0,"46":0,"48":49,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f36",lote:"—",maqNum:36,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f37",lote:"—",maqNum:36,fecha:"2026-02-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f38",lote:"—",maqNum:37,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f39",lote:"—",maqNum:37,fecha:"2026-02-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f40",lote:"—",maqNum:38,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f41",lote:"—",maqNum:38,fecha:"2026-02-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f42",lote:"—",maqNum:40,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f43",lote:"—",maqNum:41,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f44",lote:"—",maqNum:42,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:118,talles:{"42":0,"44":0,"46":0,"48":118,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f45",lote:"—",maqNum:43,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:78,talles:{"42":0,"44":0,"46":0,"48":78,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f46",lote:"—",maqNum:45,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f47",lote:"—",maqNum:50,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f48",lote:"—",maqNum:51,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f49",lote:"—",maqNum:55,fecha:"2026-02-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f50",lote:"—",maqNum:1,fecha:"2026-02-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f51",lote:"—",maqNum:5,fecha:"2026-02-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:108,talles:{"42":0,"44":0,"46":0,"48":108,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f52",lote:"—",maqNum:6,fecha:"2026-02-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:96,talles:{"42":0,"44":0,"46":0,"48":96,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f53",lote:"—",maqNum:10,fecha:"2026-02-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f54",lote:"—",maqNum:10,fecha:"2026-02-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:64,talles:{"42":0,"44":0,"46":0,"48":64,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f55",lote:"—",maqNum:11,fecha:"2026-02-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f56",lote:"—",maqNum:11,fecha:"2026-02-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:74,talles:{"42":0,"44":0,"46":0,"48":74,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f57",lote:"—",maqNum:12,fecha:"2026-02-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:58,talles:{"42":0,"44":0,"46":0,"48":58,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f58",lote:"—",maqNum:12,fecha:"2026-02-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f59",lote:"—",maqNum:13,fecha:"2026-02-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f60",lote:"—",maqNum:13,fecha:"2026-02-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:17,talles:{"42":0,"44":0,"46":0,"48":17,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f61",lote:"—",maqNum:20,fecha:"2026-02-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f62",lote:"—",maqNum:20,fecha:"2026-02-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f63",lote:"—",maqNum:21,fecha:"2026-02-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:58,talles:{"42":0,"44":0,"46":0,"48":58,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f64",lote:"—",maqNum:21,fecha:"2026-02-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f65",lote:"—",maqNum:22,fecha:"2026-02-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f66",lote:"—",maqNum:22,fecha:"2026-02-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f67",lote:"—",maqNum:23,fecha:"2026-02-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f68",lote:"—",maqNum:23,fecha:"2026-02-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f69",lote:"—",maqNum:24,fecha:"2026-02-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:55,talles:{"42":0,"44":0,"46":0,"48":55,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f70",lote:"—",maqNum:24,fecha:"2026-02-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f71",lote:"—",maqNum:25,fecha:"2026-02-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f72",lote:"—",maqNum:25,fecha:"2026-02-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f73",lote:"—",maqNum:3,fecha:"2026-02-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f74",lote:"—",maqNum:3,fecha:"2026-02-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f75",lote:"—",maqNum:30,fecha:"2026-02-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f76",lote:"—",maqNum:30,fecha:"2026-02-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f77",lote:"—",maqNum:31,fecha:"2026-02-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f78",lote:"—",maqNum:31,fecha:"2026-02-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f79",lote:"—",maqNum:32,fecha:"2026-02-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f80",lote:"—",maqNum:32,fecha:"2026-02-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f81",lote:"—",maqNum:33,fecha:"2026-02-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f82",lote:"—",maqNum:33,fecha:"2026-02-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f83",lote:"—",maqNum:34,fecha:"2026-02-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f84",lote:"—",maqNum:34,fecha:"2026-02-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f85",lote:"—",maqNum:35,fecha:"2026-02-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:49,talles:{"42":0,"44":0,"46":0,"48":49,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f86",lote:"—",maqNum:35,fecha:"2026-02-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f87",lote:"—",maqNum:36,fecha:"2026-02-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f88",lote:"—",maqNum:36,fecha:"2026-02-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f89",lote:"—",maqNum:37,fecha:"2026-02-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f90",lote:"—",maqNum:37,fecha:"2026-02-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f91",lote:"—",maqNum:38,fecha:"2026-02-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f92",lote:"—",maqNum:38,fecha:"2026-02-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f93",lote:"—",maqNum:40,fecha:"2026-02-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f94",lote:"—",maqNum:40,fecha:"2026-02-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:61,talles:{"42":0,"44":0,"46":0,"48":61,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f95",lote:"—",maqNum:41,fecha:"2026-02-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f96",lote:"—",maqNum:41,fecha:"2026-02-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f97",lote:"—",maqNum:42,fecha:"2026-02-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:110,talles:{"42":0,"44":0,"46":0,"48":110,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f98",lote:"—",maqNum:42,fecha:"2026-02-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:110,talles:{"42":0,"44":0,"46":0,"48":110,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f99",lote:"—",maqNum:43,fecha:"2026-02-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f100",lote:"—",maqNum:43,fecha:"2026-02-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f101",lote:"—",maqNum:45,fecha:"2026-02-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f102",lote:"—",maqNum:45,fecha:"2026-02-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f103",lote:"—",maqNum:1,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f104",lote:"—",maqNum:4,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f105",lote:"—",maqNum:5,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:84,talles:{"42":0,"44":0,"46":0,"48":84,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f106",lote:"—",maqNum:6,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:132,talles:{"42":0,"44":0,"46":0,"48":132,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f107",lote:"—",maqNum:10,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f108",lote:"—",maqNum:10,fecha:"2026-02-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:82,talles:{"42":0,"44":0,"46":0,"48":82,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f109",lote:"—",maqNum:11,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f110",lote:"—",maqNum:11,fecha:"2026-02-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f111",lote:"—",maqNum:12,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f112",lote:"—",maqNum:12,fecha:"2026-02-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f113",lote:"—",maqNum:13,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f114",lote:"—",maqNum:13,fecha:"2026-02-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f115",lote:"—",maqNum:20,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:61,talles:{"42":0,"44":0,"46":0,"48":61,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f116",lote:"—",maqNum:20,fecha:"2026-02-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f117",lote:"—",maqNum:21,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f118",lote:"—",maqNum:21,fecha:"2026-02-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f119",lote:"—",maqNum:22,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:64,talles:{"42":0,"44":0,"46":0,"48":64,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f120",lote:"—",maqNum:22,fecha:"2026-02-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f121",lote:"—",maqNum:23,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f122",lote:"—",maqNum:23,fecha:"2026-02-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f123",lote:"—",maqNum:24,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f124",lote:"—",maqNum:24,fecha:"2026-02-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:53,talles:{"42":0,"44":0,"46":0,"48":53,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f125",lote:"—",maqNum:25,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f126",lote:"—",maqNum:25,fecha:"2026-02-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f127",lote:"—",maqNum:3,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f128",lote:"—",maqNum:3,fecha:"2026-02-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:69,talles:{"42":0,"44":0,"46":0,"48":69,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f129",lote:"—",maqNum:30,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:5,talles:{"42":0,"44":0,"46":0,"48":5,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f130",lote:"—",maqNum:30,fecha:"2026-02-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:6,talles:{"42":0,"44":0,"46":0,"48":6,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f131",lote:"—",maqNum:31,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:21,talles:{"42":0,"44":0,"46":0,"48":21,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f132",lote:"—",maqNum:31,fecha:"2026-02-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f133",lote:"—",maqNum:32,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f134",lote:"—",maqNum:32,fecha:"2026-02-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f135",lote:"—",maqNum:33,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f136",lote:"—",maqNum:33,fecha:"2026-02-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f137",lote:"—",maqNum:34,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f138",lote:"—",maqNum:34,fecha:"2026-02-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f139",lote:"—",maqNum:35,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f140",lote:"—",maqNum:35,fecha:"2026-02-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f141",lote:"—",maqNum:36,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f142",lote:"—",maqNum:36,fecha:"2026-02-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f143",lote:"—",maqNum:37,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:21,talles:{"42":0,"44":0,"46":0,"48":21,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f144",lote:"—",maqNum:37,fecha:"2026-02-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f145",lote:"—",maqNum:38,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f146",lote:"—",maqNum:38,fecha:"2026-02-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f147",lote:"—",maqNum:40,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f148",lote:"—",maqNum:40,fecha:"2026-02-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f149",lote:"—",maqNum:41,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f150",lote:"—",maqNum:41,fecha:"2026-02-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f151",lote:"—",maqNum:42,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:114,talles:{"42":0,"44":0,"46":0,"48":114,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f152",lote:"—",maqNum:42,fecha:"2026-02-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f153",lote:"—",maqNum:43,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f154",lote:"—",maqNum:43,fecha:"2026-02-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f155",lote:"—",maqNum:45,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f156",lote:"—",maqNum:45,fecha:"2026-02-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f157",lote:"—",maqNum:50,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f158",lote:"—",maqNum:51,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f159",lote:"—",maqNum:55,fecha:"2026-02-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f160",lote:"—",maqNum:1,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f161",lote:"—",maqNum:5,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:82,talles:{"42":0,"44":0,"46":0,"48":82,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f162",lote:"—",maqNum:6,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:80,talles:{"42":0,"44":0,"46":0,"48":80,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f163",lote:"—",maqNum:10,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f164",lote:"—",maqNum:10,fecha:"2026-02-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f165",lote:"—",maqNum:11,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:78,talles:{"42":0,"44":0,"46":0,"48":78,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f166",lote:"—",maqNum:11,fecha:"2026-02-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f167",lote:"—",maqNum:12,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f168",lote:"—",maqNum:12,fecha:"2026-02-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:86,talles:{"42":0,"44":0,"46":0,"48":86,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f169",lote:"—",maqNum:13,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f170",lote:"—",maqNum:13,fecha:"2026-02-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f171",lote:"—",maqNum:20,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f172",lote:"—",maqNum:20,fecha:"2026-02-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f173",lote:"—",maqNum:21,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f174",lote:"—",maqNum:21,fecha:"2026-02-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f175",lote:"—",maqNum:22,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f176",lote:"—",maqNum:22,fecha:"2026-02-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f177",lote:"—",maqNum:23,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f178",lote:"—",maqNum:23,fecha:"2026-02-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f179",lote:"—",maqNum:24,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:53,talles:{"42":0,"44":0,"46":0,"48":53,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f180",lote:"—",maqNum:24,fecha:"2026-02-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f181",lote:"—",maqNum:25,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:59,talles:{"42":0,"44":0,"46":0,"48":59,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f182",lote:"—",maqNum:25,fecha:"2026-02-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f183",lote:"—",maqNum:3,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f184",lote:"—",maqNum:3,fecha:"2026-02-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f185",lote:"—",maqNum:30,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f186",lote:"—",maqNum:30,fecha:"2026-02-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f187",lote:"—",maqNum:31,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f188",lote:"—",maqNum:31,fecha:"2026-02-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f189",lote:"—",maqNum:32,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f190",lote:"—",maqNum:32,fecha:"2026-02-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f191",lote:"—",maqNum:33,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f192",lote:"—",maqNum:33,fecha:"2026-02-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f193",lote:"—",maqNum:34,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f194",lote:"—",maqNum:34,fecha:"2026-02-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f195",lote:"—",maqNum:35,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f196",lote:"—",maqNum:35,fecha:"2026-02-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f197",lote:"—",maqNum:36,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:21,talles:{"42":0,"44":0,"46":0,"48":21,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f198",lote:"—",maqNum:36,fecha:"2026-02-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f199",lote:"—",maqNum:37,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f200",lote:"—",maqNum:37,fecha:"2026-02-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f201",lote:"—",maqNum:38,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f202",lote:"—",maqNum:38,fecha:"2026-02-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f203",lote:"—",maqNum:40,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f204",lote:"—",maqNum:40,fecha:"2026-02-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:99,talles:{"42":0,"44":0,"46":0,"48":99,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f205",lote:"—",maqNum:41,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f206",lote:"—",maqNum:41,fecha:"2026-02-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f207",lote:"—",maqNum:42,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f208",lote:"—",maqNum:42,fecha:"2026-02-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:86,talles:{"42":0,"44":0,"46":0,"48":86,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f209",lote:"—",maqNum:43,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f210",lote:"—",maqNum:43,fecha:"2026-02-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f211",lote:"—",maqNum:45,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f212",lote:"—",maqNum:45,fecha:"2026-02-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f213",lote:"—",maqNum:50,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f214",lote:"—",maqNum:51,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f215",lote:"—",maqNum:55,fecha:"2026-02-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f216",lote:"—",maqNum:1,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f217",lote:"—",maqNum:5,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:86,talles:{"42":0,"44":0,"46":0,"48":86,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f218",lote:"—",maqNum:6,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:64,talles:{"42":0,"44":0,"46":0,"48":64,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f219",lote:"—",maqNum:10,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:58,talles:{"42":0,"44":0,"46":0,"48":58,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f220",lote:"—",maqNum:10,fecha:"2026-02-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f221",lote:"—",maqNum:11,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f222",lote:"—",maqNum:11,fecha:"2026-02-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f223",lote:"—",maqNum:12,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f224",lote:"—",maqNum:12,fecha:"2026-02-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f225",lote:"—",maqNum:13,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f226",lote:"—",maqNum:13,fecha:"2026-02-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:19,talles:{"42":0,"44":0,"46":0,"48":19,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f227",lote:"—",maqNum:20,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f228",lote:"—",maqNum:20,fecha:"2026-02-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f229",lote:"—",maqNum:21,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f230",lote:"—",maqNum:21,fecha:"2026-02-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f231",lote:"—",maqNum:22,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f232",lote:"—",maqNum:22,fecha:"2026-02-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f233",lote:"—",maqNum:23,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f234",lote:"—",maqNum:23,fecha:"2026-02-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f235",lote:"—",maqNum:24,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f236",lote:"—",maqNum:24,fecha:"2026-02-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f237",lote:"—",maqNum:25,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f238",lote:"—",maqNum:25,fecha:"2026-02-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f239",lote:"—",maqNum:3,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f240",lote:"—",maqNum:3,fecha:"2026-02-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f241",lote:"—",maqNum:30,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f242",lote:"—",maqNum:30,fecha:"2026-02-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f243",lote:"—",maqNum:31,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f244",lote:"—",maqNum:31,fecha:"2026-02-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f245",lote:"—",maqNum:32,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f246",lote:"—",maqNum:32,fecha:"2026-02-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f247",lote:"—",maqNum:33,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f248",lote:"—",maqNum:33,fecha:"2026-02-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f249",lote:"—",maqNum:34,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f250",lote:"—",maqNum:34,fecha:"2026-02-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f251",lote:"—",maqNum:35,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f252",lote:"—",maqNum:35,fecha:"2026-02-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f253",lote:"—",maqNum:36,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f254",lote:"—",maqNum:36,fecha:"2026-02-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f255",lote:"—",maqNum:37,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f256",lote:"—",maqNum:37,fecha:"2026-02-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f257",lote:"—",maqNum:38,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f258",lote:"—",maqNum:38,fecha:"2026-02-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f259",lote:"—",maqNum:40,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:85,talles:{"42":0,"44":0,"46":0,"48":85,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f260",lote:"—",maqNum:40,fecha:"2026-02-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:58,talles:{"42":0,"44":0,"46":0,"48":58,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f261",lote:"—",maqNum:41,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f262",lote:"—",maqNum:41,fecha:"2026-02-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f263",lote:"—",maqNum:42,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:106,talles:{"42":0,"44":0,"46":0,"48":106,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f264",lote:"—",maqNum:42,fecha:"2026-02-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:112,talles:{"42":0,"44":0,"46":0,"48":112,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f265",lote:"—",maqNum:43,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f266",lote:"—",maqNum:43,fecha:"2026-02-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f267",lote:"—",maqNum:45,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f268",lote:"—",maqNum:45,fecha:"2026-02-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f269",lote:"—",maqNum:50,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f270",lote:"—",maqNum:51,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f271",lote:"—",maqNum:55,fecha:"2026-02-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f272",lote:"—",maqNum:1,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f273",lote:"—",maqNum:5,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:96,talles:{"42":0,"44":0,"46":0,"48":96,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f274",lote:"—",maqNum:6,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:104,talles:{"42":0,"44":0,"46":0,"48":104,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f275",lote:"—",maqNum:10,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f276",lote:"—",maqNum:10,fecha:"2026-02-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:80,talles:{"42":0,"44":0,"46":0,"48":80,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f277",lote:"—",maqNum:11,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f278",lote:"—",maqNum:11,fecha:"2026-02-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f279",lote:"—",maqNum:12,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f280",lote:"—",maqNum:12,fecha:"2026-02-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:92,talles:{"42":0,"44":0,"46":0,"48":92,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f281",lote:"—",maqNum:13,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f282",lote:"—",maqNum:13,fecha:"2026-02-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:17,talles:{"42":0,"44":0,"46":0,"48":17,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f283",lote:"—",maqNum:20,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f284",lote:"—",maqNum:20,fecha:"2026-02-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f285",lote:"—",maqNum:21,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f286",lote:"—",maqNum:21,fecha:"2026-02-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f287",lote:"—",maqNum:22,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:53,talles:{"42":0,"44":0,"46":0,"48":53,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f288",lote:"—",maqNum:22,fecha:"2026-02-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f289",lote:"—",maqNum:23,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f290",lote:"—",maqNum:23,fecha:"2026-02-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f291",lote:"—",maqNum:24,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f292",lote:"—",maqNum:24,fecha:"2026-02-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f293",lote:"—",maqNum:25,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f294",lote:"—",maqNum:25,fecha:"2026-02-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f295",lote:"—",maqNum:3,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:10,talles:{"42":0,"44":0,"46":0,"48":10,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f296",lote:"—",maqNum:3,fecha:"2026-02-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f297",lote:"—",maqNum:30,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:7,talles:{"42":0,"44":0,"46":0,"48":7,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f298",lote:"—",maqNum:30,fecha:"2026-02-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f299",lote:"—",maqNum:31,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f300",lote:"—",maqNum:31,fecha:"2026-02-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f301",lote:"—",maqNum:32,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f302",lote:"—",maqNum:32,fecha:"2026-02-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f303",lote:"—",maqNum:33,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:7,talles:{"42":0,"44":0,"46":0,"48":7,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f304",lote:"—",maqNum:33,fecha:"2026-02-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f305",lote:"—",maqNum:34,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f306",lote:"—",maqNum:34,fecha:"2026-02-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f307",lote:"—",maqNum:35,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f308",lote:"—",maqNum:35,fecha:"2026-02-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f309",lote:"—",maqNum:36,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f310",lote:"—",maqNum:36,fecha:"2026-02-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f311",lote:"—",maqNum:37,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f312",lote:"—",maqNum:37,fecha:"2026-02-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:12,talles:{"42":0,"44":0,"46":0,"48":12,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f313",lote:"—",maqNum:38,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:8,talles:{"42":0,"44":0,"46":0,"48":8,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f314",lote:"—",maqNum:38,fecha:"2026-02-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f315",lote:"—",maqNum:40,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f316",lote:"—",maqNum:40,fecha:"2026-02-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:19,talles:{"42":0,"44":0,"46":0,"48":19,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f317",lote:"—",maqNum:41,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f318",lote:"—",maqNum:41,fecha:"2026-02-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f319",lote:"—",maqNum:42,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f320",lote:"—",maqNum:42,fecha:"2026-02-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:106,talles:{"42":0,"44":0,"46":0,"48":106,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f321",lote:"—",maqNum:43,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f322",lote:"—",maqNum:43,fecha:"2026-02-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:80,talles:{"42":0,"44":0,"46":0,"48":80,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f323",lote:"—",maqNum:45,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f324",lote:"—",maqNum:45,fecha:"2026-02-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f325",lote:"—",maqNum:50,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f326",lote:"—",maqNum:51,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f327",lote:"—",maqNum:55,fecha:"2026-02-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f328",lote:"—",maqNum:1,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f329",lote:"—",maqNum:5,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:100,talles:{"42":0,"44":0,"46":0,"48":100,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f330",lote:"—",maqNum:6,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:100,talles:{"42":0,"44":0,"46":0,"48":100,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f331",lote:"—",maqNum:10,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f332",lote:"—",maqNum:10,fecha:"2026-02-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f333",lote:"—",maqNum:11,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f334",lote:"—",maqNum:11,fecha:"2026-02-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:92,talles:{"42":0,"44":0,"46":0,"48":92,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f335",lote:"—",maqNum:12,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f336",lote:"—",maqNum:12,fecha:"2026-02-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f337",lote:"—",maqNum:13,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f338",lote:"—",maqNum:13,fecha:"2026-02-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:18,talles:{"42":0,"44":0,"46":0,"48":18,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f339",lote:"—",maqNum:20,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f340",lote:"—",maqNum:20,fecha:"2026-02-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f341",lote:"—",maqNum:21,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:61,talles:{"42":0,"44":0,"46":0,"48":61,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f342",lote:"—",maqNum:21,fecha:"2026-02-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f343",lote:"—",maqNum:22,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f344",lote:"—",maqNum:22,fecha:"2026-02-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f345",lote:"—",maqNum:23,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f346",lote:"—",maqNum:23,fecha:"2026-02-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f347",lote:"—",maqNum:24,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f348",lote:"—",maqNum:24,fecha:"2026-02-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:55,talles:{"42":0,"44":0,"46":0,"48":55,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f349",lote:"—",maqNum:25,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f350",lote:"—",maqNum:25,fecha:"2026-02-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f351",lote:"—",maqNum:3,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f352",lote:"—",maqNum:3,fecha:"2026-02-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:59,talles:{"42":0,"44":0,"46":0,"48":59,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f353",lote:"—",maqNum:30,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f354",lote:"—",maqNum:30,fecha:"2026-02-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f355",lote:"—",maqNum:31,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f356",lote:"—",maqNum:31,fecha:"2026-02-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f357",lote:"—",maqNum:32,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f358",lote:"—",maqNum:32,fecha:"2026-02-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f359",lote:"—",maqNum:33,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f360",lote:"—",maqNum:33,fecha:"2026-02-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f361",lote:"—",maqNum:34,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f362",lote:"—",maqNum:34,fecha:"2026-02-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f363",lote:"—",maqNum:35,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f364",lote:"—",maqNum:35,fecha:"2026-02-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f365",lote:"—",maqNum:36,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f366",lote:"—",maqNum:36,fecha:"2026-02-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f367",lote:"—",maqNum:37,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f368",lote:"—",maqNum:37,fecha:"2026-02-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f369",lote:"—",maqNum:38,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f370",lote:"—",maqNum:38,fecha:"2026-02-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f371",lote:"—",maqNum:41,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f372",lote:"—",maqNum:41,fecha:"2026-02-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f373",lote:"—",maqNum:42,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:114,talles:{"42":0,"44":0,"46":0,"48":114,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f374",lote:"—",maqNum:42,fecha:"2026-02-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f375",lote:"—",maqNum:43,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f376",lote:"—",maqNum:43,fecha:"2026-02-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:74,talles:{"42":0,"44":0,"46":0,"48":74,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f377",lote:"—",maqNum:45,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f378",lote:"—",maqNum:45,fecha:"2026-02-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f379",lote:"—",maqNum:50,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f380",lote:"—",maqNum:51,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f381",lote:"—",maqNum:55,fecha:"2026-02-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f382",lote:"—",maqNum:1,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f383",lote:"—",maqNum:5,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:100,talles:{"42":0,"44":0,"46":0,"48":100,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f384",lote:"—",maqNum:6,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f385",lote:"—",maqNum:10,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f386",lote:"—",maqNum:10,fecha:"2026-02-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:82,talles:{"42":0,"44":0,"46":0,"48":82,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f387",lote:"—",maqNum:11,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f388",lote:"—",maqNum:11,fecha:"2026-02-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f389",lote:"—",maqNum:12,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:98,talles:{"42":0,"44":0,"46":0,"48":98,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f390",lote:"—",maqNum:12,fecha:"2026-02-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f391",lote:"—",maqNum:13,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:19,talles:{"42":0,"44":0,"46":0,"48":19,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f392",lote:"—",maqNum:13,fecha:"2026-02-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f393",lote:"—",maqNum:20,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f394",lote:"—",maqNum:20,fecha:"2026-02-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f395",lote:"—",maqNum:21,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:64,talles:{"42":0,"44":0,"46":0,"48":64,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f396",lote:"—",maqNum:21,fecha:"2026-02-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f397",lote:"—",maqNum:22,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f398",lote:"—",maqNum:22,fecha:"2026-02-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f399",lote:"—",maqNum:23,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f400",lote:"—",maqNum:23,fecha:"2026-02-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f401",lote:"—",maqNum:24,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f402",lote:"—",maqNum:24,fecha:"2026-02-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f403",lote:"—",maqNum:25,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:55,talles:{"42":0,"44":0,"46":0,"48":55,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f404",lote:"—",maqNum:25,fecha:"2026-02-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f405",lote:"—",maqNum:3,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:63,talles:{"42":0,"44":0,"46":0,"48":63,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f406",lote:"—",maqNum:3,fecha:"2026-02-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f407",lote:"—",maqNum:30,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:12,talles:{"42":0,"44":0,"46":0,"48":12,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f408",lote:"—",maqNum:30,fecha:"2026-02-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f409",lote:"—",maqNum:31,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:18,talles:{"42":0,"44":0,"46":0,"48":18,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f410",lote:"—",maqNum:31,fecha:"2026-02-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f411",lote:"—",maqNum:32,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f412",lote:"—",maqNum:32,fecha:"2026-02-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f413",lote:"—",maqNum:33,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f414",lote:"—",maqNum:33,fecha:"2026-02-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f415",lote:"—",maqNum:34,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f416",lote:"—",maqNum:34,fecha:"2026-02-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f417",lote:"—",maqNum:35,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f418",lote:"—",maqNum:35,fecha:"2026-02-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f419",lote:"—",maqNum:36,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:17,talles:{"42":0,"44":0,"46":0,"48":17,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f420",lote:"—",maqNum:37,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f421",lote:"—",maqNum:37,fecha:"2026-02-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f422",lote:"—",maqNum:38,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f423",lote:"—",maqNum:38,fecha:"2026-02-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:5,talles:{"42":0,"44":0,"46":0,"48":5,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f424",lote:"—",maqNum:41,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:89,talles:{"42":0,"44":0,"46":0,"48":89,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f425",lote:"—",maqNum:41,fecha:"2026-02-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:57,talles:{"42":0,"44":0,"46":0,"48":57,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f426",lote:"—",maqNum:42,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:106,talles:{"42":0,"44":0,"46":0,"48":106,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f427",lote:"—",maqNum:42,fecha:"2026-02-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:94,talles:{"42":0,"44":0,"46":0,"48":94,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f428",lote:"—",maqNum:43,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:80,talles:{"42":0,"44":0,"46":0,"48":80,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f429",lote:"—",maqNum:43,fecha:"2026-02-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f430",lote:"—",maqNum:45,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f431",lote:"—",maqNum:45,fecha:"2026-02-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f432",lote:"—",maqNum:50,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f433",lote:"—",maqNum:51,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f434",lote:"—",maqNum:55,fecha:"2026-02-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f435",lote:"—",maqNum:1,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f436",lote:"—",maqNum:5,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:124,talles:{"42":0,"44":0,"46":0,"48":124,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f437",lote:"—",maqNum:6,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:88,talles:{"42":0,"44":0,"46":0,"48":88,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f438",lote:"—",maqNum:10,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f439",lote:"—",maqNum:10,fecha:"2026-02-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f440",lote:"—",maqNum:11,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f441",lote:"—",maqNum:11,fecha:"2026-02-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:74,talles:{"42":0,"44":0,"46":0,"48":74,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f442",lote:"—",maqNum:12,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:96,talles:{"42":0,"44":0,"46":0,"48":96,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f443",lote:"—",maqNum:12,fecha:"2026-02-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f444",lote:"—",maqNum:13,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:21,talles:{"42":0,"44":0,"46":0,"48":21,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f445",lote:"—",maqNum:13,fecha:"2026-02-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:19,talles:{"42":0,"44":0,"46":0,"48":19,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f446",lote:"—",maqNum:20,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f447",lote:"—",maqNum:20,fecha:"2026-02-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f448",lote:"—",maqNum:21,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f449",lote:"—",maqNum:21,fecha:"2026-02-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f450",lote:"—",maqNum:22,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f451",lote:"—",maqNum:22,fecha:"2026-02-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:51,talles:{"42":0,"44":0,"46":0,"48":51,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f452",lote:"—",maqNum:23,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f453",lote:"—",maqNum:23,fecha:"2026-02-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f454",lote:"—",maqNum:24,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f455",lote:"—",maqNum:24,fecha:"2026-02-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:59,talles:{"42":0,"44":0,"46":0,"48":59,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f456",lote:"—",maqNum:25,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f457",lote:"—",maqNum:25,fecha:"2026-02-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f458",lote:"—",maqNum:3,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f459",lote:"—",maqNum:3,fecha:"2026-02-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f460",lote:"—",maqNum:30,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f461",lote:"—",maqNum:30,fecha:"2026-02-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f462",lote:"—",maqNum:31,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f463",lote:"—",maqNum:31,fecha:"2026-02-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f464",lote:"—",maqNum:32,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:17,talles:{"42":0,"44":0,"46":0,"48":17,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f465",lote:"—",maqNum:32,fecha:"2026-02-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f466",lote:"—",maqNum:33,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f467",lote:"—",maqNum:33,fecha:"2026-02-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f468",lote:"—",maqNum:34,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f469",lote:"—",maqNum:34,fecha:"2026-02-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f470",lote:"—",maqNum:35,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f471",lote:"—",maqNum:35,fecha:"2026-02-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f472",lote:"—",maqNum:37,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f473",lote:"—",maqNum:37,fecha:"2026-02-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f474",lote:"—",maqNum:38,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f475",lote:"—",maqNum:38,fecha:"2026-02-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f476",lote:"—",maqNum:41,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f477",lote:"—",maqNum:41,fecha:"2026-02-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f478",lote:"—",maqNum:42,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:84,talles:{"42":0,"44":0,"46":0,"48":84,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f479",lote:"—",maqNum:42,fecha:"2026-02-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:94,talles:{"42":0,"44":0,"46":0,"48":94,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f480",lote:"—",maqNum:43,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:86,talles:{"42":0,"44":0,"46":0,"48":86,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f481",lote:"—",maqNum:43,fecha:"2026-02-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f482",lote:"—",maqNum:45,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f483",lote:"—",maqNum:45,fecha:"2026-02-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f484",lote:"—",maqNum:50,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f485",lote:"—",maqNum:51,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f486",lote:"—",maqNum:55,fecha:"2026-02-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f487",lote:"—",maqNum:1,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:17,talles:{"42":0,"44":0,"46":0,"48":17,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f488",lote:"—",maqNum:5,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f489",lote:"—",maqNum:6,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f490",lote:"—",maqNum:10,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f491",lote:"—",maqNum:10,fecha:"2026-02-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f492",lote:"—",maqNum:11,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f493",lote:"—",maqNum:11,fecha:"2026-02-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f494",lote:"—",maqNum:12,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f495",lote:"—",maqNum:12,fecha:"2026-02-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f496",lote:"—",maqNum:13,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:19,talles:{"42":0,"44":0,"46":0,"48":19,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f497",lote:"—",maqNum:13,fecha:"2026-02-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:19,talles:{"42":0,"44":0,"46":0,"48":19,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f498",lote:"—",maqNum:20,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f499",lote:"—",maqNum:20,fecha:"2026-02-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f500",lote:"—",maqNum:21,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f501",lote:"—",maqNum:21,fecha:"2026-02-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:51,talles:{"42":0,"44":0,"46":0,"48":51,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f502",lote:"—",maqNum:22,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:55,talles:{"42":0,"44":0,"46":0,"48":55,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f503",lote:"—",maqNum:22,fecha:"2026-02-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f504",lote:"—",maqNum:23,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:75,talles:{"42":0,"44":0,"46":0,"48":75,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f505",lote:"—",maqNum:23,fecha:"2026-02-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f506",lote:"—",maqNum:24,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f507",lote:"—",maqNum:24,fecha:"2026-02-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f508",lote:"—",maqNum:25,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f509",lote:"—",maqNum:25,fecha:"2026-02-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f510",lote:"—",maqNum:3,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f511",lote:"—",maqNum:30,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:6,talles:{"42":0,"44":0,"46":0,"48":6,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f512",lote:"—",maqNum:30,fecha:"2026-02-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:10,talles:{"42":0,"44":0,"46":0,"48":10,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f513",lote:"—",maqNum:31,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f514",lote:"—",maqNum:31,fecha:"2026-02-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f515",lote:"—",maqNum:32,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f516",lote:"—",maqNum:32,fecha:"2026-02-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f517",lote:"—",maqNum:33,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f518",lote:"—",maqNum:33,fecha:"2026-02-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f519",lote:"—",maqNum:34,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f520",lote:"—",maqNum:34,fecha:"2026-02-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f521",lote:"—",maqNum:35,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f522",lote:"—",maqNum:35,fecha:"2026-02-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f523",lote:"—",maqNum:37,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f524",lote:"—",maqNum:37,fecha:"2026-02-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f525",lote:"—",maqNum:38,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f526",lote:"—",maqNum:38,fecha:"2026-02-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f527",lote:"—",maqNum:41,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:53,talles:{"42":0,"44":0,"46":0,"48":53,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f528",lote:"—",maqNum:42,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:76,talles:{"42":0,"44":0,"46":0,"48":76,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f529",lote:"—",maqNum:43,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:64,talles:{"42":0,"44":0,"46":0,"48":64,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f530",lote:"—",maqNum:45,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f531",lote:"—",maqNum:50,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f532",lote:"—",maqNum:51,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f533",lote:"—",maqNum:55,fecha:"2026-02-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:10,talles:{"42":0,"44":0,"46":0,"48":10,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f534",lote:"—",maqNum:5,fecha:"2026-02-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f535",lote:"—",maqNum:6,fecha:"2026-02-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:82,talles:{"42":0,"44":0,"46":0,"48":82,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f536",lote:"—",maqNum:10,fecha:"2026-02-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:64,talles:{"42":0,"44":0,"46":0,"48":64,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f537",lote:"—",maqNum:10,fecha:"2026-02-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f538",lote:"—",maqNum:11,fecha:"2026-02-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f539",lote:"—",maqNum:11,fecha:"2026-02-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f540",lote:"—",maqNum:12,fecha:"2026-02-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f541",lote:"—",maqNum:12,fecha:"2026-02-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f542",lote:"—",maqNum:13,fecha:"2026-02-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:19,talles:{"42":0,"44":0,"46":0,"48":19,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f543",lote:"—",maqNum:13,fecha:"2026-02-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:19,talles:{"42":0,"44":0,"46":0,"48":19,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f544",lote:"—",maqNum:20,fecha:"2026-02-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f545",lote:"—",maqNum:20,fecha:"2026-02-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f546",lote:"—",maqNum:21,fecha:"2026-02-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f547",lote:"—",maqNum:21,fecha:"2026-02-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f548",lote:"—",maqNum:22,fecha:"2026-02-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f549",lote:"—",maqNum:22,fecha:"2026-02-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f550",lote:"—",maqNum:23,fecha:"2026-02-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f551",lote:"—",maqNum:23,fecha:"2026-02-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f552",lote:"—",maqNum:24,fecha:"2026-02-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f553",lote:"—",maqNum:24,fecha:"2026-02-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f554",lote:"—",maqNum:25,fecha:"2026-02-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f555",lote:"—",maqNum:25,fecha:"2026-02-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f556",lote:"—",maqNum:3,fecha:"2026-02-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f557",lote:"—",maqNum:3,fecha:"2026-02-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f558",lote:"—",maqNum:30,fecha:"2026-02-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:21,talles:{"42":0,"44":0,"46":0,"48":21,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f559",lote:"—",maqNum:30,fecha:"2026-02-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:21,talles:{"42":0,"44":0,"46":0,"48":21,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f560",lote:"—",maqNum:31,fecha:"2026-02-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f561",lote:"—",maqNum:31,fecha:"2026-02-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f562",lote:"—",maqNum:32,fecha:"2026-02-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f563",lote:"—",maqNum:32,fecha:"2026-02-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f564",lote:"—",maqNum:33,fecha:"2026-02-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f565",lote:"—",maqNum:33,fecha:"2026-02-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f566",lote:"—",maqNum:34,fecha:"2026-02-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f567",lote:"—",maqNum:34,fecha:"2026-02-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f568",lote:"—",maqNum:35,fecha:"2026-02-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f569",lote:"—",maqNum:35,fecha:"2026-02-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f570",lote:"—",maqNum:37,fecha:"2026-02-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f571",lote:"—",maqNum:37,fecha:"2026-02-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f572",lote:"—",maqNum:38,fecha:"2026-02-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f573",lote:"—",maqNum:38,fecha:"2026-02-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f574",lote:"—",maqNum:41,fecha:"2026-02-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f575",lote:"—",maqNum:41,fecha:"2026-02-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f576",lote:"—",maqNum:42,fecha:"2026-02-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:108,talles:{"42":0,"44":0,"46":0,"48":108,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f577",lote:"—",maqNum:42,fecha:"2026-02-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:88,talles:{"42":0,"44":0,"46":0,"48":88,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f578",lote:"—",maqNum:43,fecha:"2026-02-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f579",lote:"—",maqNum:43,fecha:"2026-02-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f580",lote:"—",maqNum:45,fecha:"2026-02-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f581",lote:"—",maqNum:45,fecha:"2026-02-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f582",lote:"—",maqNum:50,fecha:"2026-02-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:12,talles:{"42":0,"44":0,"46":0,"48":12,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f583",lote:"—",maqNum:51,fecha:"2026-02-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:10,talles:{"42":0,"44":0,"46":0,"48":10,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f584",lote:"—",maqNum:55,fecha:"2026-02-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:8,talles:{"42":0,"44":0,"46":0,"48":8,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f585",lote:"—",maqNum:1,fecha:"2026-02-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f586",lote:"—",maqNum:5,fecha:"2026-02-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:104,talles:{"42":0,"44":0,"46":0,"48":104,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f587",lote:"—",maqNum:6,fecha:"2026-02-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:100,talles:{"42":0,"44":0,"46":0,"48":100,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f588",lote:"—",maqNum:10,fecha:"2026-02-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:64,talles:{"42":0,"44":0,"46":0,"48":64,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f589",lote:"—",maqNum:11,fecha:"2026-02-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:18,talles:{"42":0,"44":0,"46":0,"48":18,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f590",lote:"—",maqNum:12,fecha:"2026-02-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f591",lote:"—",maqNum:13,fecha:"2026-02-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f592",lote:"—",maqNum:20,fecha:"2026-02-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f593",lote:"—",maqNum:21,fecha:"2026-02-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f594",lote:"—",maqNum:22,fecha:"2026-02-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f595",lote:"—",maqNum:23,fecha:"2026-02-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f596",lote:"—",maqNum:24,fecha:"2026-02-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f597",lote:"—",maqNum:25,fecha:"2026-02-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f598",lote:"—",maqNum:3,fecha:"2026-02-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f599",lote:"—",maqNum:41,fecha:"2026-02-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f600",lote:"—",maqNum:42,fecha:"2026-02-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f601",lote:"—",maqNum:43,fecha:"2026-02-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f602",lote:"—",maqNum:45,fecha:"2026-02-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f603",lote:"—",maqNum:5,fecha:"2026-02-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:86,talles:{"42":0,"44":0,"46":0,"48":86,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f604",lote:"—",maqNum:6,fecha:"2026-02-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:58,talles:{"42":0,"44":0,"46":0,"48":58,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f605",lote:"—",maqNum:10,fecha:"2026-02-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f606",lote:"—",maqNum:10,fecha:"2026-02-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:18,talles:{"42":0,"44":0,"46":0,"48":18,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f607",lote:"—",maqNum:11,fecha:"2026-02-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:88,talles:{"42":0,"44":0,"46":0,"48":88,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f608",lote:"—",maqNum:11,fecha:"2026-02-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f609",lote:"—",maqNum:12,fecha:"2026-02-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:71,talles:{"42":0,"44":0,"46":0,"48":71,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f610",lote:"—",maqNum:12,fecha:"2026-02-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f611",lote:"—",maqNum:13,fecha:"2026-02-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:18,talles:{"42":0,"44":0,"46":0,"48":18,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f612",lote:"—",maqNum:13,fecha:"2026-02-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f613",lote:"—",maqNum:20,fecha:"2026-02-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f614",lote:"—",maqNum:20,fecha:"2026-02-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f615",lote:"—",maqNum:21,fecha:"2026-02-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:59,talles:{"42":0,"44":0,"46":0,"48":59,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f616",lote:"—",maqNum:21,fecha:"2026-02-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f617",lote:"—",maqNum:22,fecha:"2026-02-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f618",lote:"—",maqNum:22,fecha:"2026-02-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f619",lote:"—",maqNum:23,fecha:"2026-02-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f620",lote:"—",maqNum:23,fecha:"2026-02-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f621",lote:"—",maqNum:24,fecha:"2026-02-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f622",lote:"—",maqNum:24,fecha:"2026-02-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f623",lote:"—",maqNum:25,fecha:"2026-02-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:67,talles:{"42":0,"44":0,"46":0,"48":67,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f624",lote:"—",maqNum:25,fecha:"2026-02-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f625",lote:"—",maqNum:3,fecha:"2026-02-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f626",lote:"—",maqNum:3,fecha:"2026-02-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:19,talles:{"42":0,"44":0,"46":0,"48":19,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f627",lote:"—",maqNum:30,fecha:"2026-02-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f628",lote:"—",maqNum:30,fecha:"2026-02-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f629",lote:"—",maqNum:31,fecha:"2026-02-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:19,talles:{"42":0,"44":0,"46":0,"48":19,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f630",lote:"—",maqNum:31,fecha:"2026-02-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f631",lote:"—",maqNum:32,fecha:"2026-02-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:17,talles:{"42":0,"44":0,"46":0,"48":17,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f632",lote:"—",maqNum:32,fecha:"2026-02-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f633",lote:"—",maqNum:33,fecha:"2026-02-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:18,talles:{"42":0,"44":0,"46":0,"48":18,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f634",lote:"—",maqNum:33,fecha:"2026-02-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f635",lote:"—",maqNum:34,fecha:"2026-02-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f636",lote:"—",maqNum:34,fecha:"2026-02-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f637",lote:"—",maqNum:35,fecha:"2026-02-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f638",lote:"—",maqNum:35,fecha:"2026-02-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f639",lote:"—",maqNum:37,fecha:"2026-02-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:4,talles:{"42":0,"44":0,"46":0,"48":4,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f640",lote:"—",maqNum:37,fecha:"2026-02-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f641",lote:"—",maqNum:38,fecha:"2026-02-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f642",lote:"—",maqNum:38,fecha:"2026-02-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f643",lote:"—",maqNum:40,fecha:"2026-02-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:12,talles:{"42":0,"44":0,"46":0,"48":12,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f644",lote:"—",maqNum:40,fecha:"2026-02-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f645",lote:"—",maqNum:41,fecha:"2026-02-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f646",lote:"—",maqNum:42,fecha:"2026-02-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f647",lote:"—",maqNum:42,fecha:"2026-02-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:114,talles:{"42":0,"44":0,"46":0,"48":114,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f648",lote:"—",maqNum:43,fecha:"2026-02-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:12,talles:{"42":0,"44":0,"46":0,"48":12,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f649",lote:"—",maqNum:43,fecha:"2026-02-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:74,talles:{"42":0,"44":0,"46":0,"48":74,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f650",lote:"—",maqNum:45,fecha:"2026-02-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:9,talles:{"42":0,"44":0,"46":0,"48":9,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f651",lote:"—",maqNum:45,fecha:"2026-02-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f652",lote:"—",maqNum:20,fecha:"2026-02-21",tejedor:"—",turno:"sabado",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f653",lote:"—",maqNum:21,fecha:"2026-02-21",tejedor:"—",turno:"sabado",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:51,talles:{"42":0,"44":0,"46":0,"48":51,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f654",lote:"—",maqNum:22,fecha:"2026-02-21",tejedor:"—",turno:"sabado",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f655",lote:"—",maqNum:23,fecha:"2026-02-21",tejedor:"—",turno:"sabado",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f656",lote:"—",maqNum:24,fecha:"2026-02-21",tejedor:"—",turno:"sabado",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f657",lote:"—",maqNum:25,fecha:"2026-02-21",tejedor:"—",turno:"sabado",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f658",lote:"—",maqNum:1,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f659",lote:"—",maqNum:5,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:78,talles:{"42":0,"44":0,"46":0,"48":78,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f660",lote:"—",maqNum:6,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:104,talles:{"42":0,"44":0,"46":0,"48":104,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f661",lote:"—",maqNum:10,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:85,talles:{"42":0,"44":0,"46":0,"48":85,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f662",lote:"—",maqNum:10,fecha:"2026-02-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:90,talles:{"42":0,"44":0,"46":0,"48":90,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f663",lote:"—",maqNum:11,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f664",lote:"—",maqNum:11,fecha:"2026-02-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f665",lote:"—",maqNum:12,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f666",lote:"—",maqNum:12,fecha:"2026-02-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f667",lote:"—",maqNum:13,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f668",lote:"—",maqNum:13,fecha:"2026-02-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:19,talles:{"42":0,"44":0,"46":0,"48":19,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f669",lote:"—",maqNum:20,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f670",lote:"—",maqNum:20,fecha:"2026-02-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f671",lote:"—",maqNum:21,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f672",lote:"—",maqNum:21,fecha:"2026-02-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f673",lote:"—",maqNum:22,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:67,talles:{"42":0,"44":0,"46":0,"48":67,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f674",lote:"—",maqNum:22,fecha:"2026-02-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f675",lote:"—",maqNum:23,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:67,talles:{"42":0,"44":0,"46":0,"48":67,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f676",lote:"—",maqNum:23,fecha:"2026-02-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f677",lote:"—",maqNum:24,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f678",lote:"—",maqNum:24,fecha:"2026-02-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f679",lote:"—",maqNum:25,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f680",lote:"—",maqNum:25,fecha:"2026-02-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f681",lote:"—",maqNum:3,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f682",lote:"—",maqNum:30,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:6,talles:{"42":0,"44":0,"46":0,"48":6,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f683",lote:"—",maqNum:30,fecha:"2026-02-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f684",lote:"—",maqNum:31,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f685",lote:"—",maqNum:31,fecha:"2026-02-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f686",lote:"—",maqNum:32,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f687",lote:"—",maqNum:32,fecha:"2026-02-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f688",lote:"—",maqNum:33,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:21,talles:{"42":0,"44":0,"46":0,"48":21,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f689",lote:"—",maqNum:33,fecha:"2026-02-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f690",lote:"—",maqNum:34,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f691",lote:"—",maqNum:34,fecha:"2026-02-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f692",lote:"—",maqNum:35,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f693",lote:"—",maqNum:35,fecha:"2026-02-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f694",lote:"—",maqNum:37,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f695",lote:"—",maqNum:37,fecha:"2026-02-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f696",lote:"—",maqNum:38,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f697",lote:"—",maqNum:38,fecha:"2026-02-23",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:4,talles:{"42":0,"44":0,"46":0,"48":4,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f698",lote:"—",maqNum:40,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f699",lote:"—",maqNum:41,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f700",lote:"—",maqNum:42,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f701",lote:"—",maqNum:43,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f702",lote:"—",maqNum:45,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:19,talles:{"42":0,"44":0,"46":0,"48":19,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f703",lote:"—",maqNum:50,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:10,talles:{"42":0,"44":0,"46":0,"48":10,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f704",lote:"—",maqNum:51,fecha:"2026-02-23",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:10,talles:{"42":0,"44":0,"46":0,"48":10,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f705",lote:"—",maqNum:1,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:51,talles:{"42":0,"44":0,"46":0,"48":51,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f706",lote:"—",maqNum:5,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:92,talles:{"42":0,"44":0,"46":0,"48":92,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f707",lote:"—",maqNum:6,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:80,talles:{"42":0,"44":0,"46":0,"48":80,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f708",lote:"—",maqNum:10,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f709",lote:"—",maqNum:11,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f710",lote:"—",maqNum:12,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f711",lote:"—",maqNum:13,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f712",lote:"—",maqNum:20,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f713",lote:"—",maqNum:20,fecha:"2026-02-24",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f714",lote:"—",maqNum:21,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f715",lote:"—",maqNum:21,fecha:"2026-02-24",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f716",lote:"—",maqNum:22,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f717",lote:"—",maqNum:22,fecha:"2026-02-24",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f718",lote:"—",maqNum:23,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f719",lote:"—",maqNum:23,fecha:"2026-02-24",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f720",lote:"—",maqNum:24,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f721",lote:"—",maqNum:24,fecha:"2026-02-24",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f722",lote:"—",maqNum:25,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f723",lote:"—",maqNum:25,fecha:"2026-02-24",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f724",lote:"—",maqNum:3,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f725",lote:"—",maqNum:30,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f726",lote:"—",maqNum:30,fecha:"2026-02-24",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f727",lote:"—",maqNum:31,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f728",lote:"—",maqNum:31,fecha:"2026-02-24",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f729",lote:"—",maqNum:32,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f730",lote:"—",maqNum:32,fecha:"2026-02-24",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:19,talles:{"42":0,"44":0,"46":0,"48":19,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f731",lote:"—",maqNum:33,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f732",lote:"—",maqNum:33,fecha:"2026-02-24",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f733",lote:"—",maqNum:34,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f734",lote:"—",maqNum:34,fecha:"2026-02-24",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f735",lote:"—",maqNum:35,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f736",lote:"—",maqNum:35,fecha:"2026-02-24",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f737",lote:"—",maqNum:37,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f738",lote:"—",maqNum:37,fecha:"2026-02-24",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f739",lote:"—",maqNum:38,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f740",lote:"—",maqNum:38,fecha:"2026-02-24",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:6,talles:{"42":0,"44":0,"46":0,"48":6,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f741",lote:"—",maqNum:40,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f742",lote:"—",maqNum:41,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f743",lote:"—",maqNum:42,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f744",lote:"—",maqNum:43,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f745",lote:"—",maqNum:45,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f746",lote:"—",maqNum:50,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:12,talles:{"42":0,"44":0,"46":0,"48":12,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f747",lote:"—",maqNum:51,fecha:"2026-02-24",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f748",lote:"—",maqNum:1,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f749",lote:"—",maqNum:5,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:96,talles:{"42":0,"44":0,"46":0,"48":96,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f750",lote:"—",maqNum:6,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:110,talles:{"42":0,"44":0,"46":0,"48":110,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f751",lote:"—",maqNum:10,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:78,talles:{"42":0,"44":0,"46":0,"48":78,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f752",lote:"—",maqNum:10,fecha:"2026-02-25",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f753",lote:"—",maqNum:11,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f754",lote:"—",maqNum:11,fecha:"2026-02-25",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f755",lote:"—",maqNum:12,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f756",lote:"—",maqNum:12,fecha:"2026-02-25",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f757",lote:"—",maqNum:13,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:21,talles:{"42":0,"44":0,"46":0,"48":21,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f758",lote:"—",maqNum:13,fecha:"2026-02-25",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f759",lote:"—",maqNum:20,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f760",lote:"—",maqNum:20,fecha:"2026-02-25",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f761",lote:"—",maqNum:21,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f762",lote:"—",maqNum:21,fecha:"2026-02-25",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f763",lote:"—",maqNum:22,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:64,talles:{"42":0,"44":0,"46":0,"48":64,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f764",lote:"—",maqNum:22,fecha:"2026-02-25",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f765",lote:"—",maqNum:23,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f766",lote:"—",maqNum:23,fecha:"2026-02-25",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:21,talles:{"42":0,"44":0,"46":0,"48":21,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f767",lote:"—",maqNum:24,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:73,talles:{"42":0,"44":0,"46":0,"48":73,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f768",lote:"—",maqNum:24,fecha:"2026-02-25",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f769",lote:"—",maqNum:25,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:61,talles:{"42":0,"44":0,"46":0,"48":61,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f770",lote:"—",maqNum:25,fecha:"2026-02-25",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f771",lote:"—",maqNum:3,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f772",lote:"—",maqNum:3,fecha:"2026-02-25",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f773",lote:"—",maqNum:30,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f774",lote:"—",maqNum:30,fecha:"2026-02-25",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f775",lote:"—",maqNum:31,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:13,talles:{"42":0,"44":0,"46":0,"48":13,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f776",lote:"—",maqNum:31,fecha:"2026-02-25",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f777",lote:"—",maqNum:32,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f778",lote:"—",maqNum:32,fecha:"2026-02-25",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f779",lote:"—",maqNum:33,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f780",lote:"—",maqNum:33,fecha:"2026-02-25",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f781",lote:"—",maqNum:34,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f782",lote:"—",maqNum:35,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f783",lote:"—",maqNum:35,fecha:"2026-02-25",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:53,talles:{"42":0,"44":0,"46":0,"48":53,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f784",lote:"—",maqNum:37,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f785",lote:"—",maqNum:37,fecha:"2026-02-25",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f786",lote:"—",maqNum:38,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:17,talles:{"42":0,"44":0,"46":0,"48":17,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f787",lote:"—",maqNum:38,fecha:"2026-02-25",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f788",lote:"—",maqNum:40,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f789",lote:"—",maqNum:40,fecha:"2026-02-25",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:18,talles:{"42":0,"44":0,"46":0,"48":18,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f790",lote:"—",maqNum:41,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f791",lote:"—",maqNum:41,fecha:"2026-02-25",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f792",lote:"—",maqNum:42,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f793",lote:"—",maqNum:42,fecha:"2026-02-25",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f794",lote:"—",maqNum:43,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:82,talles:{"42":0,"44":0,"46":0,"48":82,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f795",lote:"—",maqNum:43,fecha:"2026-02-25",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f796",lote:"—",maqNum:45,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f797",lote:"—",maqNum:45,fecha:"2026-02-25",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f798",lote:"—",maqNum:50,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:13,talles:{"42":0,"44":0,"46":0,"48":13,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f799",lote:"—",maqNum:51,fecha:"2026-02-25",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:12,talles:{"42":0,"44":0,"46":0,"48":12,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f800",lote:"—",maqNum:1,fecha:"2026-02-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f801",lote:"—",maqNum:5,fecha:"2026-02-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:96,talles:{"42":0,"44":0,"46":0,"48":96,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f802",lote:"—",maqNum:6,fecha:"2026-02-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f803",lote:"—",maqNum:10,fecha:"2026-02-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:74,talles:{"42":0,"44":0,"46":0,"48":74,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f804",lote:"—",maqNum:10,fecha:"2026-02-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f805",lote:"—",maqNum:11,fecha:"2026-02-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f806",lote:"—",maqNum:11,fecha:"2026-02-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:92,talles:{"42":0,"44":0,"46":0,"48":92,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f807",lote:"—",maqNum:12,fecha:"2026-02-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:82,talles:{"42":0,"44":0,"46":0,"48":82,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f808",lote:"—",maqNum:12,fecha:"2026-02-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f809",lote:"—",maqNum:13,fecha:"2026-02-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f810",lote:"—",maqNum:13,fecha:"2026-02-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f811",lote:"—",maqNum:20,fecha:"2026-02-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f812",lote:"—",maqNum:20,fecha:"2026-02-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f813",lote:"—",maqNum:21,fecha:"2026-02-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:57,talles:{"42":0,"44":0,"46":0,"48":57,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f814",lote:"—",maqNum:21,fecha:"2026-02-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f815",lote:"—",maqNum:22,fecha:"2026-02-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:18,talles:{"42":0,"44":0,"46":0,"48":18,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f816",lote:"—",maqNum:22,fecha:"2026-02-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f817",lote:"—",maqNum:23,fecha:"2026-02-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f818",lote:"—",maqNum:23,fecha:"2026-02-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f819",lote:"—",maqNum:24,fecha:"2026-02-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f820",lote:"—",maqNum:24,fecha:"2026-02-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f821",lote:"—",maqNum:25,fecha:"2026-02-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f822",lote:"—",maqNum:25,fecha:"2026-02-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:49,talles:{"42":0,"44":0,"46":0,"48":49,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f823",lote:"—",maqNum:3,fecha:"2026-02-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:63,talles:{"42":0,"44":0,"46":0,"48":63,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f824",lote:"—",maqNum:3,fecha:"2026-02-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f825",lote:"—",maqNum:30,fecha:"2026-02-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f826",lote:"—",maqNum:30,fecha:"2026-02-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f827",lote:"—",maqNum:31,fecha:"2026-02-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f828",lote:"—",maqNum:31,fecha:"2026-02-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f829",lote:"—",maqNum:32,fecha:"2026-02-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f830",lote:"—",maqNum:32,fecha:"2026-02-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f831",lote:"—",maqNum:33,fecha:"2026-02-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f832",lote:"—",maqNum:33,fecha:"2026-02-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f833",lote:"—",maqNum:34,fecha:"2026-02-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f834",lote:"—",maqNum:35,fecha:"2026-02-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f835",lote:"—",maqNum:35,fecha:"2026-02-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f836",lote:"—",maqNum:37,fecha:"2026-02-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f837",lote:"—",maqNum:37,fecha:"2026-02-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f838",lote:"—",maqNum:38,fecha:"2026-02-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f839",lote:"—",maqNum:38,fecha:"2026-02-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f840",lote:"—",maqNum:41,fecha:"2026-02-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:69,talles:{"42":0,"44":0,"46":0,"48":69,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f841",lote:"—",maqNum:42,fecha:"2026-02-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f842",lote:"—",maqNum:42,fecha:"2026-02-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f843",lote:"—",maqNum:43,fecha:"2026-02-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:104,talles:{"42":0,"44":0,"46":0,"48":104,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f844",lote:"—",maqNum:43,fecha:"2026-02-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:88,talles:{"42":0,"44":0,"46":0,"48":88,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f845",lote:"—",maqNum:45,fecha:"2026-02-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f846",lote:"—",maqNum:45,fecha:"2026-02-26",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f847",lote:"—",maqNum:50,fecha:"2026-02-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:10,talles:{"42":0,"44":0,"46":0,"48":10,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f848",lote:"—",maqNum:51,fecha:"2026-02-26",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:10,talles:{"42":0,"44":0,"46":0,"48":10,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f849",lote:"—",maqNum:1,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f850",lote:"—",maqNum:5,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:96,talles:{"42":0,"44":0,"46":0,"48":96,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f851",lote:"—",maqNum:6,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:88,talles:{"42":0,"44":0,"46":0,"48":88,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f852",lote:"—",maqNum:10,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:58,talles:{"42":0,"44":0,"46":0,"48":58,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f853",lote:"—",maqNum:10,fecha:"2026-02-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:78,talles:{"42":0,"44":0,"46":0,"48":78,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f854",lote:"—",maqNum:11,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f855",lote:"—",maqNum:11,fecha:"2026-02-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f856",lote:"—",maqNum:12,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f857",lote:"—",maqNum:12,fecha:"2026-02-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:64,talles:{"42":0,"44":0,"46":0,"48":64,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f858",lote:"—",maqNum:13,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f859",lote:"—",maqNum:13,fecha:"2026-02-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:19,talles:{"42":0,"44":0,"46":0,"48":19,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f860",lote:"—",maqNum:20,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f861",lote:"—",maqNum:20,fecha:"2026-02-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f862",lote:"—",maqNum:21,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f863",lote:"—",maqNum:21,fecha:"2026-02-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f864",lote:"—",maqNum:22,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:73,talles:{"42":0,"44":0,"46":0,"48":73,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f865",lote:"—",maqNum:22,fecha:"2026-02-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f866",lote:"—",maqNum:23,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:63,talles:{"42":0,"44":0,"46":0,"48":63,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f867",lote:"—",maqNum:23,fecha:"2026-02-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f868",lote:"—",maqNum:24,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f869",lote:"—",maqNum:24,fecha:"2026-02-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f870",lote:"—",maqNum:25,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:73,talles:{"42":0,"44":0,"46":0,"48":73,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f871",lote:"—",maqNum:25,fecha:"2026-02-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:55,talles:{"42":0,"44":0,"46":0,"48":55,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f872",lote:"—",maqNum:3,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:61,talles:{"42":0,"44":0,"46":0,"48":61,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f873",lote:"—",maqNum:30,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f874",lote:"—",maqNum:30,fecha:"2026-02-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f875",lote:"—",maqNum:31,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f876",lote:"—",maqNum:31,fecha:"2026-02-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f877",lote:"—",maqNum:32,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f878",lote:"—",maqNum:32,fecha:"2026-02-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f879",lote:"—",maqNum:33,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f880",lote:"—",maqNum:33,fecha:"2026-02-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f881",lote:"—",maqNum:34,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f882",lote:"—",maqNum:34,fecha:"2026-02-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f883",lote:"—",maqNum:35,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f884",lote:"—",maqNum:35,fecha:"2026-02-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f885",lote:"—",maqNum:37,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f886",lote:"—",maqNum:37,fecha:"2026-02-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f887",lote:"—",maqNum:38,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f888",lote:"—",maqNum:38,fecha:"2026-02-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f889",lote:"—",maqNum:40,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f890",lote:"—",maqNum:40,fecha:"2026-02-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f891",lote:"—",maqNum:41,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f892",lote:"—",maqNum:41,fecha:"2026-02-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f893",lote:"—",maqNum:42,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f894",lote:"—",maqNum:42,fecha:"2026-02-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:58,talles:{"42":0,"44":0,"46":0,"48":58,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f895",lote:"—",maqNum:43,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:114,talles:{"42":0,"44":0,"46":0,"48":114,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f896",lote:"—",maqNum:43,fecha:"2026-02-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:80,talles:{"42":0,"44":0,"46":0,"48":80,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f897",lote:"—",maqNum:45,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f898",lote:"—",maqNum:45,fecha:"2026-02-27",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f899",lote:"—",maqNum:50,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:13,talles:{"42":0,"44":0,"46":0,"48":13,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"f900",lote:"—",maqNum:51,fecha:"2026-02-27",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:10,talles:{"42":0,"44":0,"46":0,"48":10,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x0",lote:"—",maqNum:1,fecha:"2026-03-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x1",lote:"—",maqNum:5,fecha:"2026-03-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:4,talles:{"42":0,"44":0,"46":0,"48":4,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x2",lote:"—",maqNum:6,fecha:"2026-03-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:82,talles:{"42":0,"44":0,"46":0,"48":82,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x3",lote:"—",maqNum:10,fecha:"2026-03-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x4",lote:"—",maqNum:10,fecha:"2026-03-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x5",lote:"—",maqNum:11,fecha:"2026-03-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:74,talles:{"42":0,"44":0,"46":0,"48":74,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x6",lote:"—",maqNum:11,fecha:"2026-03-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:58,talles:{"42":0,"44":0,"46":0,"48":58,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x7",lote:"—",maqNum:12,fecha:"2026-03-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:74,talles:{"42":0,"44":0,"46":0,"48":74,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x8",lote:"—",maqNum:12,fecha:"2026-03-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x9",lote:"—",maqNum:13,fecha:"2026-03-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x10",lote:"—",maqNum:13,fecha:"2026-03-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x11",lote:"—",maqNum:20,fecha:"2026-03-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:61,talles:{"42":0,"44":0,"46":0,"48":61,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x12",lote:"—",maqNum:20,fecha:"2026-03-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x13",lote:"—",maqNum:21,fecha:"2026-03-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:58,talles:{"42":0,"44":0,"46":0,"48":58,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x14",lote:"—",maqNum:21,fecha:"2026-03-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x15",lote:"—",maqNum:22,fecha:"2026-03-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x16",lote:"—",maqNum:22,fecha:"2026-03-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x17",lote:"—",maqNum:23,fecha:"2026-03-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x18",lote:"—",maqNum:23,fecha:"2026-03-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x19",lote:"—",maqNum:24,fecha:"2026-03-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x20",lote:"—",maqNum:24,fecha:"2026-03-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x21",lote:"—",maqNum:25,fecha:"2026-03-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x22",lote:"—",maqNum:25,fecha:"2026-03-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x23",lote:"—",maqNum:3,fecha:"2026-03-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:58,talles:{"42":0,"44":0,"46":0,"48":58,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x24",lote:"—",maqNum:3,fecha:"2026-03-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x25",lote:"—",maqNum:30,fecha:"2026-03-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:18,talles:{"42":0,"44":0,"46":0,"48":18,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x26",lote:"—",maqNum:30,fecha:"2026-03-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x27",lote:"—",maqNum:31,fecha:"2026-03-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:19,talles:{"42":0,"44":0,"46":0,"48":19,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x28",lote:"—",maqNum:31,fecha:"2026-03-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x29",lote:"—",maqNum:32,fecha:"2026-03-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x30",lote:"—",maqNum:32,fecha:"2026-03-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:17,talles:{"42":0,"44":0,"46":0,"48":17,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x31",lote:"—",maqNum:33,fecha:"2026-03-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x32",lote:"—",maqNum:33,fecha:"2026-03-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x33",lote:"—",maqNum:34,fecha:"2026-03-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x34",lote:"—",maqNum:34,fecha:"2026-03-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x35",lote:"—",maqNum:35,fecha:"2026-03-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x36",lote:"—",maqNum:35,fecha:"2026-03-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x37",lote:"—",maqNum:37,fecha:"2026-03-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x38",lote:"—",maqNum:37,fecha:"2026-03-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x39",lote:"—",maqNum:38,fecha:"2026-03-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x40",lote:"—",maqNum:38,fecha:"2026-03-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x41",lote:"—",maqNum:40,fecha:"2026-03-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x42",lote:"—",maqNum:40,fecha:"2026-03-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x43",lote:"—",maqNum:41,fecha:"2026-03-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x44",lote:"—",maqNum:41,fecha:"2026-03-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x45",lote:"—",maqNum:42,fecha:"2026-03-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x46",lote:"—",maqNum:42,fecha:"2026-03-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x47",lote:"—",maqNum:43,fecha:"2026-03-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:76,talles:{"42":0,"44":0,"46":0,"48":76,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x48",lote:"—",maqNum:43,fecha:"2026-03-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x49",lote:"—",maqNum:45,fecha:"2026-03-02",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:21,talles:{"42":0,"44":0,"46":0,"48":21,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x50",lote:"—",maqNum:45,fecha:"2026-03-02",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x51",lote:"—",maqNum:1,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x52",lote:"—",maqNum:6,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x53",lote:"—",maqNum:10,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:80,talles:{"42":0,"44":0,"46":0,"48":80,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x54",lote:"—",maqNum:10,fecha:"2026-03-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x55",lote:"—",maqNum:11,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:78,talles:{"42":0,"44":0,"46":0,"48":78,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x56",lote:"—",maqNum:11,fecha:"2026-03-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x57",lote:"—",maqNum:12,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:78,talles:{"42":0,"44":0,"46":0,"48":78,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x58",lote:"—",maqNum:12,fecha:"2026-03-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x59",lote:"—",maqNum:13,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:19,talles:{"42":0,"44":0,"46":0,"48":19,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x60",lote:"—",maqNum:13,fecha:"2026-03-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:17,talles:{"42":0,"44":0,"46":0,"48":17,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x61",lote:"—",maqNum:20,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x62",lote:"—",maqNum:20,fecha:"2026-03-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:49,talles:{"42":0,"44":0,"46":0,"48":49,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x63",lote:"—",maqNum:21,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x64",lote:"—",maqNum:21,fecha:"2026-03-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x65",lote:"—",maqNum:22,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:67,talles:{"42":0,"44":0,"46":0,"48":67,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x66",lote:"—",maqNum:22,fecha:"2026-03-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x67",lote:"—",maqNum:23,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x68",lote:"—",maqNum:23,fecha:"2026-03-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x69",lote:"—",maqNum:24,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:71,talles:{"42":0,"44":0,"46":0,"48":71,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x70",lote:"—",maqNum:24,fecha:"2026-03-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:55,talles:{"42":0,"44":0,"46":0,"48":55,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x71",lote:"—",maqNum:25,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x72",lote:"—",maqNum:25,fecha:"2026-03-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x73",lote:"—",maqNum:3,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:17,talles:{"42":0,"44":0,"46":0,"48":17,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x74",lote:"—",maqNum:30,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x75",lote:"—",maqNum:30,fecha:"2026-03-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x76",lote:"—",maqNum:31,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x77",lote:"—",maqNum:31,fecha:"2026-03-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x78",lote:"—",maqNum:32,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x79",lote:"—",maqNum:32,fecha:"2026-03-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x80",lote:"—",maqNum:33,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x81",lote:"—",maqNum:33,fecha:"2026-03-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x82",lote:"—",maqNum:34,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x83",lote:"—",maqNum:34,fecha:"2026-03-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x84",lote:"—",maqNum:35,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x85",lote:"—",maqNum:35,fecha:"2026-03-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x86",lote:"—",maqNum:37,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x87",lote:"—",maqNum:37,fecha:"2026-03-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x88",lote:"—",maqNum:38,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x89",lote:"—",maqNum:38,fecha:"2026-03-03",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x90",lote:"—",maqNum:40,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x91",lote:"—",maqNum:41,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x92",lote:"—",maqNum:42,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:102,talles:{"42":0,"44":0,"46":0,"48":102,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x93",lote:"—",maqNum:43,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:58,talles:{"42":0,"44":0,"46":0,"48":58,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x94",lote:"—",maqNum:45,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x95",lote:"—",maqNum:50,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x96",lote:"—",maqNum:51,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x97",lote:"—",maqNum:55,fecha:"2026-03-03",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x98",lote:"—",maqNum:1,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:9,talles:{"42":0,"44":0,"46":0,"48":9,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x99",lote:"—",maqNum:5,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:148,talles:{"42":0,"44":0,"46":0,"48":148,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x100",lote:"—",maqNum:6,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:140,talles:{"42":0,"44":0,"46":0,"48":140,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x101",lote:"—",maqNum:10,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x102",lote:"—",maqNum:10,fecha:"2026-03-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x103",lote:"—",maqNum:11,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:84,talles:{"42":0,"44":0,"46":0,"48":84,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x104",lote:"—",maqNum:11,fecha:"2026-03-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x105",lote:"—",maqNum:12,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x106",lote:"—",maqNum:12,fecha:"2026-03-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x107",lote:"—",maqNum:13,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x108",lote:"—",maqNum:13,fecha:"2026-03-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:21,talles:{"42":0,"44":0,"46":0,"48":21,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x109",lote:"—",maqNum:20,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:51,talles:{"42":0,"44":0,"46":0,"48":51,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x110",lote:"—",maqNum:20,fecha:"2026-03-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:59,talles:{"42":0,"44":0,"46":0,"48":59,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x111",lote:"—",maqNum:21,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x112",lote:"—",maqNum:21,fecha:"2026-03-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x113",lote:"—",maqNum:22,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x114",lote:"—",maqNum:22,fecha:"2026-03-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x115",lote:"—",maqNum:23,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x116",lote:"—",maqNum:23,fecha:"2026-03-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x117",lote:"—",maqNum:24,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:74,talles:{"42":0,"44":0,"46":0,"48":74,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x118",lote:"—",maqNum:24,fecha:"2026-03-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x119",lote:"—",maqNum:25,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x120",lote:"—",maqNum:25,fecha:"2026-03-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x121",lote:"—",maqNum:3,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x122",lote:"—",maqNum:30,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x123",lote:"—",maqNum:30,fecha:"2026-03-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x124",lote:"—",maqNum:31,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x125",lote:"—",maqNum:31,fecha:"2026-03-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x126",lote:"—",maqNum:32,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x127",lote:"—",maqNum:32,fecha:"2026-03-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x128",lote:"—",maqNum:33,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x129",lote:"—",maqNum:33,fecha:"2026-03-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x130",lote:"—",maqNum:34,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x131",lote:"—",maqNum:34,fecha:"2026-03-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x132",lote:"—",maqNum:35,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x133",lote:"—",maqNum:35,fecha:"2026-03-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x134",lote:"—",maqNum:37,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x135",lote:"—",maqNum:37,fecha:"2026-03-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x136",lote:"—",maqNum:38,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x137",lote:"—",maqNum:38,fecha:"2026-03-04",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:5,talles:{"42":0,"44":0,"46":0,"48":5,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x138",lote:"—",maqNum:40,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:69,talles:{"42":0,"44":0,"46":0,"48":69,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x139",lote:"—",maqNum:41,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x140",lote:"—",maqNum:42,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x141",lote:"—",maqNum:43,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x142",lote:"—",maqNum:45,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x143",lote:"—",maqNum:50,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x144",lote:"—",maqNum:51,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x145",lote:"—",maqNum:55,fecha:"2026-03-04",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x146",lote:"—",maqNum:5,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:104,talles:{"42":0,"44":0,"46":0,"48":104,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x147",lote:"—",maqNum:6,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:110,talles:{"42":0,"44":0,"46":0,"48":110,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x148",lote:"—",maqNum:10,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x149",lote:"—",maqNum:10,fecha:"2026-03-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x150",lote:"—",maqNum:11,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x151",lote:"—",maqNum:11,fecha:"2026-03-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x152",lote:"—",maqNum:12,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x153",lote:"—",maqNum:12,fecha:"2026-03-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:64,talles:{"42":0,"44":0,"46":0,"48":64,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x154",lote:"—",maqNum:13,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x155",lote:"—",maqNum:13,fecha:"2026-03-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:18,talles:{"42":0,"44":0,"46":0,"48":18,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x156",lote:"—",maqNum:20,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:71,talles:{"42":0,"44":0,"46":0,"48":71,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x157",lote:"—",maqNum:20,fecha:"2026-03-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x158",lote:"—",maqNum:21,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:64,talles:{"42":0,"44":0,"46":0,"48":64,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x159",lote:"—",maqNum:21,fecha:"2026-03-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x160",lote:"—",maqNum:22,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x161",lote:"—",maqNum:22,fecha:"2026-03-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x162",lote:"—",maqNum:23,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x163",lote:"—",maqNum:23,fecha:"2026-03-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:57,talles:{"42":0,"44":0,"46":0,"48":57,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x164",lote:"—",maqNum:24,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:67,talles:{"42":0,"44":0,"46":0,"48":67,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x165",lote:"—",maqNum:24,fecha:"2026-03-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:53,talles:{"42":0,"44":0,"46":0,"48":53,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x166",lote:"—",maqNum:25,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x167",lote:"—",maqNum:25,fecha:"2026-03-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:57,talles:{"42":0,"44":0,"46":0,"48":57,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x168",lote:"—",maqNum:3,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x169",lote:"—",maqNum:3,fecha:"2026-03-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x170",lote:"—",maqNum:30,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x171",lote:"—",maqNum:30,fecha:"2026-03-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x172",lote:"—",maqNum:31,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x173",lote:"—",maqNum:31,fecha:"2026-03-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:74,talles:{"42":0,"44":0,"46":0,"48":74,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x174",lote:"—",maqNum:32,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x175",lote:"—",maqNum:32,fecha:"2026-03-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x176",lote:"—",maqNum:33,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x177",lote:"—",maqNum:33,fecha:"2026-03-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x178",lote:"—",maqNum:34,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x179",lote:"—",maqNum:34,fecha:"2026-03-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x180",lote:"—",maqNum:35,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x181",lote:"—",maqNum:35,fecha:"2026-03-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x182",lote:"—",maqNum:37,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x183",lote:"—",maqNum:37,fecha:"2026-03-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x184",lote:"—",maqNum:38,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x185",lote:"—",maqNum:38,fecha:"2026-03-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:21,talles:{"42":0,"44":0,"46":0,"48":21,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x186",lote:"—",maqNum:40,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:63,talles:{"42":0,"44":0,"46":0,"48":63,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x187",lote:"—",maqNum:40,fecha:"2026-03-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:11,talles:{"42":0,"44":0,"46":0,"48":11,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x188",lote:"—",maqNum:41,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x189",lote:"—",maqNum:41,fecha:"2026-03-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x190",lote:"—",maqNum:42,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x191",lote:"—",maqNum:42,fecha:"2026-03-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:98,talles:{"42":0,"44":0,"46":0,"48":98,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x192",lote:"—",maqNum:43,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x193",lote:"—",maqNum:43,fecha:"2026-03-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x194",lote:"—",maqNum:45,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x195",lote:"—",maqNum:45,fecha:"2026-03-05",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x196",lote:"—",maqNum:50,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x197",lote:"—",maqNum:51,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x198",lote:"—",maqNum:55,fecha:"2026-03-05",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:13,talles:{"42":0,"44":0,"46":0,"48":13,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x199",lote:"—",maqNum:5,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:90,talles:{"42":0,"44":0,"46":0,"48":90,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x200",lote:"—",maqNum:6,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:96,talles:{"42":0,"44":0,"46":0,"48":96,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x201",lote:"—",maqNum:10,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x202",lote:"—",maqNum:10,fecha:"2026-03-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x203",lote:"—",maqNum:11,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:71,talles:{"42":0,"44":0,"46":0,"48":71,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x204",lote:"—",maqNum:11,fecha:"2026-03-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x205",lote:"—",maqNum:12,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:74,talles:{"42":0,"44":0,"46":0,"48":74,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x206",lote:"—",maqNum:12,fecha:"2026-03-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:74,talles:{"42":0,"44":0,"46":0,"48":74,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x207",lote:"—",maqNum:13,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:8,talles:{"42":0,"44":0,"46":0,"48":8,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x208",lote:"—",maqNum:20,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:67,talles:{"42":0,"44":0,"46":0,"48":67,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x209",lote:"—",maqNum:20,fecha:"2026-03-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x210",lote:"—",maqNum:21,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x211",lote:"—",maqNum:21,fecha:"2026-03-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x212",lote:"—",maqNum:22,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:64,talles:{"42":0,"44":0,"46":0,"48":64,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x213",lote:"—",maqNum:22,fecha:"2026-03-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x214",lote:"—",maqNum:23,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:63,talles:{"42":0,"44":0,"46":0,"48":63,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x215",lote:"—",maqNum:23,fecha:"2026-03-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x216",lote:"—",maqNum:24,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:58,talles:{"42":0,"44":0,"46":0,"48":58,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x217",lote:"—",maqNum:24,fecha:"2026-03-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:53,talles:{"42":0,"44":0,"46":0,"48":53,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x218",lote:"—",maqNum:25,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:58,talles:{"42":0,"44":0,"46":0,"48":58,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x219",lote:"—",maqNum:25,fecha:"2026-03-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:51,talles:{"42":0,"44":0,"46":0,"48":51,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x220",lote:"—",maqNum:3,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x221",lote:"—",maqNum:3,fecha:"2026-03-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x222",lote:"—",maqNum:30,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x223",lote:"—",maqNum:30,fecha:"2026-03-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x224",lote:"—",maqNum:31,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x225",lote:"—",maqNum:31,fecha:"2026-03-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x226",lote:"—",maqNum:32,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x227",lote:"—",maqNum:32,fecha:"2026-03-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x228",lote:"—",maqNum:33,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x229",lote:"—",maqNum:33,fecha:"2026-03-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x230",lote:"—",maqNum:34,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x231",lote:"—",maqNum:34,fecha:"2026-03-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x232",lote:"—",maqNum:35,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x233",lote:"—",maqNum:35,fecha:"2026-03-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x234",lote:"—",maqNum:36,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x235",lote:"—",maqNum:36,fecha:"2026-03-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x236",lote:"—",maqNum:37,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x237",lote:"—",maqNum:37,fecha:"2026-03-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x238",lote:"—",maqNum:38,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x239",lote:"—",maqNum:38,fecha:"2026-03-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x240",lote:"—",maqNum:40,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x241",lote:"—",maqNum:41,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x242",lote:"—",maqNum:41,fecha:"2026-03-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x243",lote:"—",maqNum:42,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x244",lote:"—",maqNum:42,fecha:"2026-03-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:114,talles:{"42":0,"44":0,"46":0,"48":114,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x245",lote:"—",maqNum:43,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x246",lote:"—",maqNum:43,fecha:"2026-03-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x247",lote:"—",maqNum:45,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x248",lote:"—",maqNum:45,fecha:"2026-03-06",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x249",lote:"—",maqNum:50,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x250",lote:"—",maqNum:51,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x251",lote:"—",maqNum:55,fecha:"2026-03-06",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x252",lote:"—",maqNum:5,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x253",lote:"—",maqNum:5,fecha:"2026-03-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:82,talles:{"42":0,"44":0,"46":0,"48":82,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x254",lote:"—",maqNum:6,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:106,talles:{"42":0,"44":0,"46":0,"48":106,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x255",lote:"—",maqNum:10,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x256",lote:"—",maqNum:10,fecha:"2026-03-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x257",lote:"—",maqNum:11,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x258",lote:"—",maqNum:11,fecha:"2026-03-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x259",lote:"—",maqNum:12,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x260",lote:"—",maqNum:12,fecha:"2026-03-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:74,talles:{"42":0,"44":0,"46":0,"48":74,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x261",lote:"—",maqNum:20,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x262",lote:"—",maqNum:20,fecha:"2026-03-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x263",lote:"—",maqNum:21,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:73,talles:{"42":0,"44":0,"46":0,"48":73,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x264",lote:"—",maqNum:21,fecha:"2026-03-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x265",lote:"—",maqNum:22,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:57,talles:{"42":0,"44":0,"46":0,"48":57,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x266",lote:"—",maqNum:22,fecha:"2026-03-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:49,talles:{"42":0,"44":0,"46":0,"48":49,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x267",lote:"—",maqNum:23,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x268",lote:"—",maqNum:23,fecha:"2026-03-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x269",lote:"—",maqNum:24,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:65,talles:{"42":0,"44":0,"46":0,"48":65,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x270",lote:"—",maqNum:24,fecha:"2026-03-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x271",lote:"—",maqNum:25,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:65,talles:{"42":0,"44":0,"46":0,"48":65,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x272",lote:"—",maqNum:25,fecha:"2026-03-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x273",lote:"—",maqNum:3,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:21,talles:{"42":0,"44":0,"46":0,"48":21,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x274",lote:"—",maqNum:3,fecha:"2026-03-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x275",lote:"—",maqNum:30,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x276",lote:"—",maqNum:30,fecha:"2026-03-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x277",lote:"—",maqNum:31,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x278",lote:"—",maqNum:31,fecha:"2026-03-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x279",lote:"—",maqNum:32,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x280",lote:"—",maqNum:32,fecha:"2026-03-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x281",lote:"—",maqNum:33,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x282",lote:"—",maqNum:33,fecha:"2026-03-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x283",lote:"—",maqNum:34,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x284",lote:"—",maqNum:34,fecha:"2026-03-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x285",lote:"—",maqNum:35,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x286",lote:"—",maqNum:35,fecha:"2026-03-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x287",lote:"—",maqNum:36,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x288",lote:"—",maqNum:36,fecha:"2026-03-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x289",lote:"—",maqNum:37,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x290",lote:"—",maqNum:37,fecha:"2026-03-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x291",lote:"—",maqNum:38,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:13,talles:{"42":0,"44":0,"46":0,"48":13,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x292",lote:"—",maqNum:38,fecha:"2026-03-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:13,talles:{"42":0,"44":0,"46":0,"48":13,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x293",lote:"—",maqNum:40,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:12,talles:{"42":0,"44":0,"46":0,"48":12,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x294",lote:"—",maqNum:40,fecha:"2026-03-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x295",lote:"—",maqNum:41,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:51,talles:{"42":0,"44":0,"46":0,"48":51,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x296",lote:"—",maqNum:41,fecha:"2026-03-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x297",lote:"—",maqNum:42,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:102,talles:{"42":0,"44":0,"46":0,"48":102,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x298",lote:"—",maqNum:42,fecha:"2026-03-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:94,talles:{"42":0,"44":0,"46":0,"48":94,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x299",lote:"—",maqNum:43,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:64,talles:{"42":0,"44":0,"46":0,"48":64,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x300",lote:"—",maqNum:43,fecha:"2026-03-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x301",lote:"—",maqNum:45,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x302",lote:"—",maqNum:45,fecha:"2026-03-09",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x303",lote:"—",maqNum:50,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x304",lote:"—",maqNum:51,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x305",lote:"—",maqNum:55,fecha:"2026-03-09",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x306",lote:"—",maqNum:5,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:88,talles:{"42":0,"44":0,"46":0,"48":88,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x307",lote:"—",maqNum:5,fecha:"2026-03-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:96,talles:{"42":0,"44":0,"46":0,"48":96,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x308",lote:"—",maqNum:6,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:128,talles:{"42":0,"44":0,"46":0,"48":128,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x309",lote:"—",maqNum:10,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:67,talles:{"42":0,"44":0,"46":0,"48":67,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x310",lote:"—",maqNum:10,fecha:"2026-03-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:71,talles:{"42":0,"44":0,"46":0,"48":71,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x311",lote:"—",maqNum:11,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x312",lote:"—",maqNum:11,fecha:"2026-03-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x313",lote:"—",maqNum:12,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x314",lote:"—",maqNum:12,fecha:"2026-03-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:76,talles:{"42":0,"44":0,"46":0,"48":76,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x315",lote:"—",maqNum:20,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x316",lote:"—",maqNum:20,fecha:"2026-03-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x317",lote:"—",maqNum:21,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:58,talles:{"42":0,"44":0,"46":0,"48":58,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x318",lote:"—",maqNum:21,fecha:"2026-03-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x319",lote:"—",maqNum:22,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x320",lote:"—",maqNum:22,fecha:"2026-03-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x321",lote:"—",maqNum:23,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x322",lote:"—",maqNum:23,fecha:"2026-03-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x323",lote:"—",maqNum:24,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x324",lote:"—",maqNum:24,fecha:"2026-03-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x325",lote:"—",maqNum:25,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x326",lote:"—",maqNum:25,fecha:"2026-03-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x327",lote:"—",maqNum:3,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x328",lote:"—",maqNum:3,fecha:"2026-03-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x329",lote:"—",maqNum:30,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:18,talles:{"42":0,"44":0,"46":0,"48":18,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x330",lote:"—",maqNum:30,fecha:"2026-03-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x331",lote:"—",maqNum:31,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x332",lote:"—",maqNum:31,fecha:"2026-03-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x333",lote:"—",maqNum:32,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x334",lote:"—",maqNum:32,fecha:"2026-03-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x335",lote:"—",maqNum:33,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x336",lote:"—",maqNum:33,fecha:"2026-03-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x337",lote:"—",maqNum:34,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x338",lote:"—",maqNum:34,fecha:"2026-03-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x339",lote:"—",maqNum:35,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x340",lote:"—",maqNum:35,fecha:"2026-03-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x341",lote:"—",maqNum:36,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x342",lote:"—",maqNum:36,fecha:"2026-03-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:19,talles:{"42":0,"44":0,"46":0,"48":19,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x343",lote:"—",maqNum:37,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x344",lote:"—",maqNum:37,fecha:"2026-03-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x345",lote:"—",maqNum:38,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x346",lote:"—",maqNum:38,fecha:"2026-03-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x347",lote:"—",maqNum:40,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x348",lote:"—",maqNum:40,fecha:"2026-03-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x349",lote:"—",maqNum:41,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x350",lote:"—",maqNum:41,fecha:"2026-03-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x351",lote:"—",maqNum:42,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x352",lote:"—",maqNum:43,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x353",lote:"—",maqNum:43,fecha:"2026-03-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x354",lote:"—",maqNum:45,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x355",lote:"—",maqNum:45,fecha:"2026-03-10",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x356",lote:"—",maqNum:50,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x357",lote:"—",maqNum:51,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x358",lote:"—",maqNum:55,fecha:"2026-03-10",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:8,talles:{"42":0,"44":0,"46":0,"48":8,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x359",lote:"—",maqNum:5,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:86,talles:{"42":0,"44":0,"46":0,"48":86,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x360",lote:"—",maqNum:5,fecha:"2026-03-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:94,talles:{"42":0,"44":0,"46":0,"48":94,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x361",lote:"—",maqNum:6,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:120,talles:{"42":0,"44":0,"46":0,"48":120,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x362",lote:"—",maqNum:6,fecha:"2026-03-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:146,talles:{"42":0,"44":0,"46":0,"48":146,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x363",lote:"—",maqNum:10,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x364",lote:"—",maqNum:11,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:74,talles:{"42":0,"44":0,"46":0,"48":74,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x365",lote:"—",maqNum:11,fecha:"2026-03-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x366",lote:"—",maqNum:12,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:74,talles:{"42":0,"44":0,"46":0,"48":74,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x367",lote:"—",maqNum:12,fecha:"2026-03-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:2,talles:{"42":0,"44":0,"46":0,"48":2,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x368",lote:"—",maqNum:20,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x369",lote:"—",maqNum:20,fecha:"2026-03-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x370",lote:"—",maqNum:21,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:53,talles:{"42":0,"44":0,"46":0,"48":53,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x371",lote:"—",maqNum:21,fecha:"2026-03-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x372",lote:"—",maqNum:22,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:57,talles:{"42":0,"44":0,"46":0,"48":57,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x373",lote:"—",maqNum:22,fecha:"2026-03-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:53,talles:{"42":0,"44":0,"46":0,"48":53,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x374",lote:"—",maqNum:23,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x375",lote:"—",maqNum:23,fecha:"2026-03-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x376",lote:"—",maqNum:24,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x377",lote:"—",maqNum:24,fecha:"2026-03-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:17,talles:{"42":0,"44":0,"46":0,"48":17,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x378",lote:"—",maqNum:25,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x379",lote:"—",maqNum:25,fecha:"2026-03-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:9,talles:{"42":0,"44":0,"46":0,"48":9,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x380",lote:"—",maqNum:3,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:59,talles:{"42":0,"44":0,"46":0,"48":59,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x381",lote:"—",maqNum:3,fecha:"2026-03-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:55,talles:{"42":0,"44":0,"46":0,"48":55,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x382",lote:"—",maqNum:30,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:21,talles:{"42":0,"44":0,"46":0,"48":21,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x383",lote:"—",maqNum:30,fecha:"2026-03-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x384",lote:"—",maqNum:31,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x385",lote:"—",maqNum:31,fecha:"2026-03-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x386",lote:"—",maqNum:32,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x387",lote:"—",maqNum:32,fecha:"2026-03-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x388",lote:"—",maqNum:33,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x389",lote:"—",maqNum:33,fecha:"2026-03-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x390",lote:"—",maqNum:34,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x391",lote:"—",maqNum:34,fecha:"2026-03-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x392",lote:"—",maqNum:35,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x393",lote:"—",maqNum:35,fecha:"2026-03-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x394",lote:"—",maqNum:36,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x395",lote:"—",maqNum:36,fecha:"2026-03-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x396",lote:"—",maqNum:37,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x397",lote:"—",maqNum:37,fecha:"2026-03-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x398",lote:"—",maqNum:38,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:21,talles:{"42":0,"44":0,"46":0,"48":21,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x399",lote:"—",maqNum:38,fecha:"2026-03-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:4,talles:{"42":0,"44":0,"46":0,"48":4,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x400",lote:"—",maqNum:40,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x401",lote:"—",maqNum:40,fecha:"2026-03-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x402",lote:"—",maqNum:41,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x403",lote:"—",maqNum:41,fecha:"2026-03-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x404",lote:"—",maqNum:42,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:4,talles:{"42":0,"44":0,"46":0,"48":4,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x405",lote:"—",maqNum:42,fecha:"2026-03-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x406",lote:"—",maqNum:43,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x407",lote:"—",maqNum:43,fecha:"2026-03-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x408",lote:"—",maqNum:45,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x409",lote:"—",maqNum:45,fecha:"2026-03-11",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x410",lote:"—",maqNum:50,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x411",lote:"—",maqNum:51,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x412",lote:"—",maqNum:55,fecha:"2026-03-11",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x413",lote:"—",maqNum:5,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x414",lote:"—",maqNum:6,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x415",lote:"—",maqNum:10,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x416",lote:"—",maqNum:11,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x417",lote:"—",maqNum:12,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x418",lote:"—",maqNum:20,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:49,talles:{"42":0,"44":0,"46":0,"48":49,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x419",lote:"—",maqNum:20,fecha:"2026-03-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x420",lote:"—",maqNum:21,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x421",lote:"—",maqNum:21,fecha:"2026-03-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:51,talles:{"42":0,"44":0,"46":0,"48":51,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x422",lote:"—",maqNum:22,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:65,talles:{"42":0,"44":0,"46":0,"48":65,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x423",lote:"—",maqNum:22,fecha:"2026-03-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x424",lote:"—",maqNum:23,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x425",lote:"—",maqNum:23,fecha:"2026-03-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x426",lote:"—",maqNum:24,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x427",lote:"—",maqNum:24,fecha:"2026-03-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x428",lote:"—",maqNum:25,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:44,talles:{"42":0,"44":0,"46":0,"48":44,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x429",lote:"—",maqNum:25,fecha:"2026-03-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x430",lote:"—",maqNum:3,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x431",lote:"—",maqNum:3,fecha:"2026-03-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x432",lote:"—",maqNum:30,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:8,talles:{"42":0,"44":0,"46":0,"48":8,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x433",lote:"—",maqNum:30,fecha:"2026-03-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x434",lote:"—",maqNum:31,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x435",lote:"—",maqNum:31,fecha:"2026-03-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x436",lote:"—",maqNum:32,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x437",lote:"—",maqNum:32,fecha:"2026-03-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x438",lote:"—",maqNum:33,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x439",lote:"—",maqNum:33,fecha:"2026-03-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x440",lote:"—",maqNum:34,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x441",lote:"—",maqNum:34,fecha:"2026-03-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x442",lote:"—",maqNum:35,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x443",lote:"—",maqNum:35,fecha:"2026-03-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x444",lote:"—",maqNum:36,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x445",lote:"—",maqNum:36,fecha:"2026-03-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x446",lote:"—",maqNum:37,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x447",lote:"—",maqNum:37,fecha:"2026-03-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x448",lote:"—",maqNum:38,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x449",lote:"—",maqNum:38,fecha:"2026-03-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x450",lote:"—",maqNum:40,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x451",lote:"—",maqNum:40,fecha:"2026-03-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:80,talles:{"42":0,"44":0,"46":0,"48":80,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x452",lote:"—",maqNum:41,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x453",lote:"—",maqNum:41,fecha:"2026-03-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x454",lote:"—",maqNum:42,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x455",lote:"—",maqNum:42,fecha:"2026-03-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x456",lote:"—",maqNum:43,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:84,talles:{"42":0,"44":0,"46":0,"48":84,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x457",lote:"—",maqNum:43,fecha:"2026-03-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:64,talles:{"42":0,"44":0,"46":0,"48":64,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x458",lote:"—",maqNum:45,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x459",lote:"—",maqNum:45,fecha:"2026-03-12",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x460",lote:"—",maqNum:50,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:14,talles:{"42":0,"44":0,"46":0,"48":14,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x461",lote:"—",maqNum:51,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x462",lote:"—",maqNum:55,fecha:"2026-03-12",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x463",lote:"—",maqNum:5,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x464",lote:"—",maqNum:6,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x465",lote:"—",maqNum:10,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x466",lote:"—",maqNum:10,fecha:"2026-03-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x467",lote:"—",maqNum:11,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x468",lote:"—",maqNum:11,fecha:"2026-03-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x469",lote:"—",maqNum:12,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x470",lote:"—",maqNum:12,fecha:"2026-03-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x471",lote:"—",maqNum:20,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x472",lote:"—",maqNum:20,fecha:"2026-03-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x473",lote:"—",maqNum:21,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:51,talles:{"42":0,"44":0,"46":0,"48":51,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x474",lote:"—",maqNum:21,fecha:"2026-03-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x475",lote:"—",maqNum:22,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:57,talles:{"42":0,"44":0,"46":0,"48":57,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x476",lote:"—",maqNum:22,fecha:"2026-03-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x477",lote:"—",maqNum:23,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x478",lote:"—",maqNum:23,fecha:"2026-03-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:51,talles:{"42":0,"44":0,"46":0,"48":51,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x479",lote:"—",maqNum:24,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:57,talles:{"42":0,"44":0,"46":0,"48":57,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x480",lote:"—",maqNum:24,fecha:"2026-03-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:51,talles:{"42":0,"44":0,"46":0,"48":51,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x481",lote:"—",maqNum:25,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x482",lote:"—",maqNum:25,fecha:"2026-03-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x483",lote:"—",maqNum:3,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x484",lote:"—",maqNum:3,fecha:"2026-03-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x485",lote:"—",maqNum:30,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:10,talles:{"42":0,"44":0,"46":0,"48":10,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x486",lote:"—",maqNum:31,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x487",lote:"—",maqNum:32,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x488",lote:"—",maqNum:33,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x489",lote:"—",maqNum:34,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x490",lote:"—",maqNum:35,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x491",lote:"—",maqNum:36,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x492",lote:"—",maqNum:37,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x493",lote:"—",maqNum:38,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:18,talles:{"42":0,"44":0,"46":0,"48":18,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x494",lote:"—",maqNum:40,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:70,talles:{"42":0,"44":0,"46":0,"48":70,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x495",lote:"—",maqNum:40,fecha:"2026-03-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x496",lote:"—",maqNum:41,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x497",lote:"—",maqNum:41,fecha:"2026-03-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x498",lote:"—",maqNum:42,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x499",lote:"—",maqNum:42,fecha:"2026-03-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x500",lote:"—",maqNum:43,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:112,talles:{"42":0,"44":0,"46":0,"48":112,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x501",lote:"—",maqNum:43,fecha:"2026-03-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:108,talles:{"42":0,"44":0,"46":0,"48":108,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x502",lote:"—",maqNum:45,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x503",lote:"—",maqNum:45,fecha:"2026-03-13",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x504",lote:"—",maqNum:50,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x505",lote:"—",maqNum:51,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x506",lote:"—",maqNum:55,fecha:"2026-03-13",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x507",lote:"—",maqNum:10,fecha:"2026-03-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x508",lote:"—",maqNum:10,fecha:"2026-03-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x509",lote:"—",maqNum:11,fecha:"2026-03-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x510",lote:"—",maqNum:11,fecha:"2026-03-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:74,talles:{"42":0,"44":0,"46":0,"48":74,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x511",lote:"—",maqNum:12,fecha:"2026-03-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x512",lote:"—",maqNum:12,fecha:"2026-03-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x513",lote:"—",maqNum:20,fecha:"2026-03-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:65,talles:{"42":0,"44":0,"46":0,"48":65,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x514",lote:"—",maqNum:20,fecha:"2026-03-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x515",lote:"—",maqNum:21,fecha:"2026-03-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:63,talles:{"42":0,"44":0,"46":0,"48":63,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x516",lote:"—",maqNum:21,fecha:"2026-03-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x517",lote:"—",maqNum:22,fecha:"2026-03-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x518",lote:"—",maqNum:22,fecha:"2026-03-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x519",lote:"—",maqNum:23,fecha:"2026-03-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:49,talles:{"42":0,"44":0,"46":0,"48":49,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x520",lote:"—",maqNum:23,fecha:"2026-03-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x521",lote:"—",maqNum:24,fecha:"2026-03-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:71,talles:{"42":0,"44":0,"46":0,"48":71,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x522",lote:"—",maqNum:24,fecha:"2026-03-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x523",lote:"—",maqNum:25,fecha:"2026-03-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:49,talles:{"42":0,"44":0,"46":0,"48":49,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x524",lote:"—",maqNum:25,fecha:"2026-03-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x525",lote:"—",maqNum:3,fecha:"2026-03-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x526",lote:"—",maqNum:3,fecha:"2026-03-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x527",lote:"—",maqNum:30,fecha:"2026-03-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:10,talles:{"42":0,"44":0,"46":0,"48":10,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x528",lote:"—",maqNum:30,fecha:"2026-03-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x529",lote:"—",maqNum:31,fecha:"2026-03-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:18,talles:{"42":0,"44":0,"46":0,"48":18,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x530",lote:"—",maqNum:31,fecha:"2026-03-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:100,talles:{"42":0,"44":0,"46":0,"48":100,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x531",lote:"—",maqNum:32,fecha:"2026-03-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x532",lote:"—",maqNum:32,fecha:"2026-03-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:10,talles:{"42":0,"44":0,"46":0,"48":10,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x533",lote:"—",maqNum:33,fecha:"2026-03-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x534",lote:"—",maqNum:34,fecha:"2026-03-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x535",lote:"—",maqNum:34,fecha:"2026-03-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x536",lote:"—",maqNum:35,fecha:"2026-03-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:29,talles:{"42":0,"44":0,"46":0,"48":29,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x537",lote:"—",maqNum:35,fecha:"2026-03-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:10,talles:{"42":0,"44":0,"46":0,"48":10,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x538",lote:"—",maqNum:36,fecha:"2026-03-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:19,talles:{"42":0,"44":0,"46":0,"48":19,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x539",lote:"—",maqNum:36,fecha:"2026-03-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x540",lote:"—",maqNum:37,fecha:"2026-03-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x541",lote:"—",maqNum:37,fecha:"2026-03-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x542",lote:"—",maqNum:38,fecha:"2026-03-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:17,talles:{"42":0,"44":0,"46":0,"48":17,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x543",lote:"—",maqNum:38,fecha:"2026-03-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x544",lote:"—",maqNum:40,fecha:"2026-03-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x545",lote:"—",maqNum:40,fecha:"2026-03-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x546",lote:"—",maqNum:41,fecha:"2026-03-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x547",lote:"—",maqNum:41,fecha:"2026-03-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x548",lote:"—",maqNum:42,fecha:"2026-03-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x549",lote:"—",maqNum:42,fecha:"2026-03-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x550",lote:"—",maqNum:43,fecha:"2026-03-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:108,talles:{"42":0,"44":0,"46":0,"48":108,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x551",lote:"—",maqNum:43,fecha:"2026-03-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:58,talles:{"42":0,"44":0,"46":0,"48":58,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x552",lote:"—",maqNum:45,fecha:"2026-03-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x553",lote:"—",maqNum:45,fecha:"2026-03-16",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x554",lote:"—",maqNum:50,fecha:"2026-03-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x555",lote:"—",maqNum:51,fecha:"2026-03-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x556",lote:"—",maqNum:55,fecha:"2026-03-16",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:10,talles:{"42":0,"44":0,"46":0,"48":10,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x557",lote:"—",maqNum:10,fecha:"2026-03-17",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x558",lote:"—",maqNum:10,fecha:"2026-03-17",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x559",lote:"—",maqNum:11,fecha:"2026-03-17",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x560",lote:"—",maqNum:11,fecha:"2026-03-17",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x561",lote:"—",maqNum:12,fecha:"2026-03-17",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x562",lote:"—",maqNum:12,fecha:"2026-03-17",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:18,talles:{"42":0,"44":0,"46":0,"48":18,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x563",lote:"—",maqNum:20,fecha:"2026-03-17",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:80,talles:{"42":0,"44":0,"46":0,"48":80,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x564",lote:"—",maqNum:20,fecha:"2026-03-17",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x565",lote:"—",maqNum:21,fecha:"2026-03-17",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:67,talles:{"42":0,"44":0,"46":0,"48":67,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x566",lote:"—",maqNum:21,fecha:"2026-03-17",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:53,talles:{"42":0,"44":0,"46":0,"48":53,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x567",lote:"—",maqNum:22,fecha:"2026-03-17",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:53,talles:{"42":0,"44":0,"46":0,"48":53,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x568",lote:"—",maqNum:22,fecha:"2026-03-17",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x569",lote:"—",maqNum:23,fecha:"2026-03-17",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:53,talles:{"42":0,"44":0,"46":0,"48":53,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x570",lote:"—",maqNum:23,fecha:"2026-03-17",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x571",lote:"—",maqNum:24,fecha:"2026-03-17",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x572",lote:"—",maqNum:24,fecha:"2026-03-17",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x573",lote:"—",maqNum:25,fecha:"2026-03-17",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:77,talles:{"42":0,"44":0,"46":0,"48":77,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x574",lote:"—",maqNum:25,fecha:"2026-03-17",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x575",lote:"—",maqNum:3,fecha:"2026-03-17",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:67,talles:{"42":0,"44":0,"46":0,"48":67,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x576",lote:"—",maqNum:30,fecha:"2026-03-17",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:7,talles:{"42":0,"44":0,"46":0,"48":7,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x577",lote:"—",maqNum:30,fecha:"2026-03-17",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x578",lote:"—",maqNum:31,fecha:"2026-03-17",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x579",lote:"—",maqNum:31,fecha:"2026-03-17",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x580",lote:"—",maqNum:32,fecha:"2026-03-17",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x581",lote:"—",maqNum:32,fecha:"2026-03-17",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x582",lote:"—",maqNum:33,fecha:"2026-03-17",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x583",lote:"—",maqNum:33,fecha:"2026-03-17",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x584",lote:"—",maqNum:34,fecha:"2026-03-17",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x585",lote:"—",maqNum:34,fecha:"2026-03-17",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:18,talles:{"42":0,"44":0,"46":0,"48":18,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x586",lote:"—",maqNum:35,fecha:"2026-03-17",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x587",lote:"—",maqNum:35,fecha:"2026-03-17",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x588",lote:"—",maqNum:36,fecha:"2026-03-17",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x589",lote:"—",maqNum:36,fecha:"2026-03-17",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x590",lote:"—",maqNum:37,fecha:"2026-03-17",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x591",lote:"—",maqNum:37,fecha:"2026-03-17",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:17,talles:{"42":0,"44":0,"46":0,"48":17,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x592",lote:"—",maqNum:38,fecha:"2026-03-17",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:17,talles:{"42":0,"44":0,"46":0,"48":17,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x593",lote:"—",maqNum:40,fecha:"2026-03-17",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x594",lote:"—",maqNum:41,fecha:"2026-03-17",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:53,talles:{"42":0,"44":0,"46":0,"48":53,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x595",lote:"—",maqNum:42,fecha:"2026-03-17",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x596",lote:"—",maqNum:43,fecha:"2026-03-17",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x597",lote:"—",maqNum:45,fecha:"2026-03-17",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x598",lote:"—",maqNum:50,fecha:"2026-03-17",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x599",lote:"—",maqNum:51,fecha:"2026-03-17",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x600",lote:"—",maqNum:10,fecha:"2026-03-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x601",lote:"—",maqNum:10,fecha:"2026-03-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x602",lote:"—",maqNum:11,fecha:"2026-03-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x603",lote:"—",maqNum:11,fecha:"2026-03-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x604",lote:"—",maqNum:12,fecha:"2026-03-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:62,talles:{"42":0,"44":0,"46":0,"48":62,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x605",lote:"—",maqNum:12,fecha:"2026-03-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x606",lote:"—",maqNum:13,fecha:"2026-03-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:6,talles:{"42":0,"44":0,"46":0,"48":6,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x607",lote:"—",maqNum:13,fecha:"2026-03-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x608",lote:"—",maqNum:20,fecha:"2026-03-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:63,talles:{"42":0,"44":0,"46":0,"48":63,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x609",lote:"—",maqNum:20,fecha:"2026-03-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x610",lote:"—",maqNum:21,fecha:"2026-03-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:55,talles:{"42":0,"44":0,"46":0,"48":55,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x611",lote:"—",maqNum:21,fecha:"2026-03-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x612",lote:"—",maqNum:22,fecha:"2026-03-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x613",lote:"—",maqNum:22,fecha:"2026-03-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x614",lote:"—",maqNum:23,fecha:"2026-03-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x615",lote:"—",maqNum:23,fecha:"2026-03-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:55,talles:{"42":0,"44":0,"46":0,"48":55,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x616",lote:"—",maqNum:24,fecha:"2026-03-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:63,talles:{"42":0,"44":0,"46":0,"48":63,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x617",lote:"—",maqNum:24,fecha:"2026-03-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x618",lote:"—",maqNum:25,fecha:"2026-03-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x619",lote:"—",maqNum:25,fecha:"2026-03-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:56,talles:{"42":0,"44":0,"46":0,"48":56,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x620",lote:"—",maqNum:3,fecha:"2026-03-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:12,talles:{"42":0,"44":0,"46":0,"48":12,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x621",lote:"—",maqNum:30,fecha:"2026-03-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x622",lote:"—",maqNum:30,fecha:"2026-03-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x623",lote:"—",maqNum:31,fecha:"2026-03-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x624",lote:"—",maqNum:31,fecha:"2026-03-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x625",lote:"—",maqNum:32,fecha:"2026-03-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x626",lote:"—",maqNum:32,fecha:"2026-03-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x627",lote:"—",maqNum:33,fecha:"2026-03-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x628",lote:"—",maqNum:33,fecha:"2026-03-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:21,talles:{"42":0,"44":0,"46":0,"48":21,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x629",lote:"—",maqNum:34,fecha:"2026-03-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x630",lote:"—",maqNum:34,fecha:"2026-03-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x631",lote:"—",maqNum:35,fecha:"2026-03-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:24,talles:{"42":0,"44":0,"46":0,"48":24,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x632",lote:"—",maqNum:35,fecha:"2026-03-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x633",lote:"—",maqNum:36,fecha:"2026-03-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x634",lote:"—",maqNum:36,fecha:"2026-03-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x635",lote:"—",maqNum:37,fecha:"2026-03-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x636",lote:"—",maqNum:37,fecha:"2026-03-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x637",lote:"—",maqNum:38,fecha:"2026-03-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x638",lote:"—",maqNum:38,fecha:"2026-03-18",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:12,talles:{"42":0,"44":0,"46":0,"48":12,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x639",lote:"—",maqNum:40,fecha:"2026-03-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x640",lote:"—",maqNum:41,fecha:"2026-03-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x641",lote:"—",maqNum:42,fecha:"2026-03-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:54,talles:{"42":0,"44":0,"46":0,"48":54,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x642",lote:"—",maqNum:43,fecha:"2026-03-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:72,talles:{"42":0,"44":0,"46":0,"48":72,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x643",lote:"—",maqNum:45,fecha:"2026-03-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x644",lote:"—",maqNum:50,fecha:"2026-03-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x645",lote:"—",maqNum:51,fecha:"2026-03-18",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x646",lote:"—",maqNum:10,fecha:"2026-03-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x647",lote:"—",maqNum:10,fecha:"2026-03-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x648",lote:"—",maqNum:11,fecha:"2026-03-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:32,talles:{"42":0,"44":0,"46":0,"48":32,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x649",lote:"—",maqNum:11,fecha:"2026-03-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:48,talles:{"42":0,"44":0,"46":0,"48":48,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x650",lote:"—",maqNum:12,fecha:"2026-03-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x651",lote:"—",maqNum:12,fecha:"2026-03-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x652",lote:"—",maqNum:13,fecha:"2026-03-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:21,talles:{"42":0,"44":0,"46":0,"48":21,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x653",lote:"—",maqNum:13,fecha:"2026-03-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:18,talles:{"42":0,"44":0,"46":0,"48":18,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x654",lote:"—",maqNum:20,fecha:"2026-03-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:53,talles:{"42":0,"44":0,"46":0,"48":53,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x655",lote:"—",maqNum:20,fecha:"2026-03-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x656",lote:"—",maqNum:21,fecha:"2026-03-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:67,talles:{"42":0,"44":0,"46":0,"48":67,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x657",lote:"—",maqNum:21,fecha:"2026-03-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x658",lote:"—",maqNum:22,fecha:"2026-03-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:46,talles:{"42":0,"44":0,"46":0,"48":46,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x659",lote:"—",maqNum:22,fecha:"2026-03-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x660",lote:"—",maqNum:23,fecha:"2026-03-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:55,talles:{"42":0,"44":0,"46":0,"48":55,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x661",lote:"—",maqNum:23,fecha:"2026-03-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x662",lote:"—",maqNum:24,fecha:"2026-03-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:59,talles:{"42":0,"44":0,"46":0,"48":59,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x663",lote:"—",maqNum:24,fecha:"2026-03-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:55,talles:{"42":0,"44":0,"46":0,"48":55,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x664",lote:"—",maqNum:25,fecha:"2026-03-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:59,talles:{"42":0,"44":0,"46":0,"48":59,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x665",lote:"—",maqNum:25,fecha:"2026-03-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:55,talles:{"42":0,"44":0,"46":0,"48":55,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x666",lote:"—",maqNum:30,fecha:"2026-03-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x667",lote:"—",maqNum:30,fecha:"2026-03-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:25,talles:{"42":0,"44":0,"46":0,"48":25,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x668",lote:"—",maqNum:31,fecha:"2026-03-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x669",lote:"—",maqNum:31,fecha:"2026-03-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x670",lote:"—",maqNum:32,fecha:"2026-03-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x671",lote:"—",maqNum:32,fecha:"2026-03-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x672",lote:"—",maqNum:33,fecha:"2026-03-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x673",lote:"—",maqNum:33,fecha:"2026-03-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:18,talles:{"42":0,"44":0,"46":0,"48":18,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x674",lote:"—",maqNum:34,fecha:"2026-03-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:37,talles:{"42":0,"44":0,"46":0,"48":37,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x675",lote:"—",maqNum:34,fecha:"2026-03-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:42,talles:{"42":0,"44":0,"46":0,"48":42,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x676",lote:"—",maqNum:35,fecha:"2026-03-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:45,talles:{"42":0,"44":0,"46":0,"48":45,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x677",lote:"—",maqNum:35,fecha:"2026-03-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x678",lote:"—",maqNum:36,fecha:"2026-03-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x679",lote:"—",maqNum:36,fecha:"2026-03-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:31,talles:{"42":0,"44":0,"46":0,"48":31,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x680",lote:"—",maqNum:37,fecha:"2026-03-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x681",lote:"—",maqNum:37,fecha:"2026-03-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:34,talles:{"42":0,"44":0,"46":0,"48":34,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x682",lote:"—",maqNum:38,fecha:"2026-03-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:21,talles:{"42":0,"44":0,"46":0,"48":21,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x683",lote:"—",maqNum:38,fecha:"2026-03-19",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x684",lote:"—",maqNum:40,fecha:"2026-03-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:17,talles:{"42":0,"44":0,"46":0,"48":17,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x685",lote:"—",maqNum:41,fecha:"2026-03-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x686",lote:"—",maqNum:42,fecha:"2026-03-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:74,talles:{"42":0,"44":0,"46":0,"48":74,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x687",lote:"—",maqNum:43,fecha:"2026-03-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x688",lote:"—",maqNum:45,fecha:"2026-03-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:19,talles:{"42":0,"44":0,"46":0,"48":19,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x689",lote:"—",maqNum:50,fecha:"2026-03-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x690",lote:"—",maqNum:51,fecha:"2026-03-19",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x691",lote:"—",maqNum:10,fecha:"2026-03-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:76,talles:{"42":0,"44":0,"46":0,"48":76,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x692",lote:"—",maqNum:10,fecha:"2026-03-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x693",lote:"—",maqNum:11,fecha:"2026-03-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x694",lote:"—",maqNum:11,fecha:"2026-03-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:66,talles:{"42":0,"44":0,"46":0,"48":66,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x695",lote:"—",maqNum:12,fecha:"2026-03-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:68,talles:{"42":0,"44":0,"46":0,"48":68,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x696",lote:"—",maqNum:12,fecha:"2026-03-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x697",lote:"—",maqNum:13,fecha:"2026-03-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x698",lote:"—",maqNum:13,fecha:"2026-03-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:19,talles:{"42":0,"44":0,"46":0,"48":19,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x699",lote:"—",maqNum:20,fecha:"2026-03-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:64,talles:{"42":0,"44":0,"46":0,"48":64,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x700",lote:"—",maqNum:20,fecha:"2026-03-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x701",lote:"—",maqNum:21,fecha:"2026-03-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:58,talles:{"42":0,"44":0,"46":0,"48":58,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x702",lote:"—",maqNum:21,fecha:"2026-03-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:47,talles:{"42":0,"44":0,"46":0,"48":47,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x703",lote:"—",maqNum:22,fecha:"2026-03-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:39,talles:{"42":0,"44":0,"46":0,"48":39,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x704",lote:"—",maqNum:22,fecha:"2026-03-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x705",lote:"—",maqNum:23,fecha:"2026-03-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x706",lote:"—",maqNum:23,fecha:"2026-03-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x707",lote:"—",maqNum:24,fecha:"2026-03-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:60,talles:{"42":0,"44":0,"46":0,"48":60,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x708",lote:"—",maqNum:24,fecha:"2026-03-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:41,talles:{"42":0,"44":0,"46":0,"48":41,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x709",lote:"—",maqNum:25,fecha:"2026-03-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:61,talles:{"42":0,"44":0,"46":0,"48":61,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x710",lote:"—",maqNum:25,fecha:"2026-03-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:40,talles:{"42":0,"44":0,"46":0,"48":40,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x711",lote:"—",maqNum:30,fecha:"2026-03-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x712",lote:"—",maqNum:30,fecha:"2026-03-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x713",lote:"—",maqNum:31,fecha:"2026-03-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:43,talles:{"42":0,"44":0,"46":0,"48":43,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x714",lote:"—",maqNum:31,fecha:"2026-03-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:19,talles:{"42":0,"44":0,"46":0,"48":19,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x715",lote:"—",maqNum:32,fecha:"2026-03-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x716",lote:"—",maqNum:32,fecha:"2026-03-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:23,talles:{"42":0,"44":0,"46":0,"48":23,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x717",lote:"—",maqNum:33,fecha:"2026-03-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:36,talles:{"42":0,"44":0,"46":0,"48":36,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x718",lote:"—",maqNum:33,fecha:"2026-03-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:22,talles:{"42":0,"44":0,"46":0,"48":22,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x719",lote:"—",maqNum:34,fecha:"2026-03-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x720",lote:"—",maqNum:34,fecha:"2026-03-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:11,talles:{"42":0,"44":0,"46":0,"48":11,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x721",lote:"—",maqNum:35,fecha:"2026-03-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:50,talles:{"42":0,"44":0,"46":0,"48":50,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x722",lote:"—",maqNum:35,fecha:"2026-03-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:52,talles:{"42":0,"44":0,"46":0,"48":52,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x723",lote:"—",maqNum:36,fecha:"2026-03-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x724",lote:"—",maqNum:36,fecha:"2026-03-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:30,talles:{"42":0,"44":0,"46":0,"48":30,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x725",lote:"—",maqNum:37,fecha:"2026-03-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:38,talles:{"42":0,"44":0,"46":0,"48":38,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x726",lote:"—",maqNum:37,fecha:"2026-03-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:21,talles:{"42":0,"44":0,"46":0,"48":21,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x727",lote:"—",maqNum:38,fecha:"2026-03-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x728",lote:"—",maqNum:38,fecha:"2026-03-20",tejedor:"—",turno:"noche",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:13,talles:{"42":0,"44":0,"46":0,"48":13,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x729",lote:"—",maqNum:40,fecha:"2026-03-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:16,talles:{"42":0,"44":0,"46":0,"48":16,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x730",lote:"—",maqNum:41,fecha:"2026-03-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:20,talles:{"42":0,"44":0,"46":0,"48":20,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x731",lote:"—",maqNum:42,fecha:"2026-03-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x732",lote:"—",maqNum:43,fecha:"2026-03-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x733",lote:"—",maqNum:45,fecha:"2026-03-20",tejedor:"—",turno:"dia",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:15,talles:{"42":0,"44":0,"46":0,"48":15,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x734",lote:"—",maqNum:20,fecha:"2026-03-21",tejedor:"—",turno:"sabado",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:35,talles:{"42":0,"44":0,"46":0,"48":35,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x735",lote:"—",maqNum:21,fecha:"2026-03-21",tejedor:"—",turno:"sabado",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:33,talles:{"42":0,"44":0,"46":0,"48":33,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x736",lote:"—",maqNum:22,fecha:"2026-03-21",tejedor:"—",turno:"sabado",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:26,talles:{"42":0,"44":0,"46":0,"48":26,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x737",lote:"—",maqNum:23,fecha:"2026-03-21",tejedor:"—",turno:"sabado",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x738",lote:"—",maqNum:24,fecha:"2026-03-21",tejedor:"—",turno:"sabado",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:28,talles:{"42":0,"44":0,"46":0,"48":28,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}},
  {id:"x739",lote:"—",maqNum:25,fecha:"2026-03-21",tejedor:"—",turno:"sabado",articulo:"estandar",obs:"",pieza:"—",talle:"—",cantidad:27,talles:{"42":0,"44":0,"46":0,"48":27,"50":0,"52":0,"54":0,"56":0,"58":0,"60":0,"62":0}}
];
const DEMO_REG=[...DATOS_XLSX];

const DEMO_HORAS=[];
DAYS_30.forEach(fecha=>{
  MAQUINAS.forEach(m=>{
    const tieneReg=DEMO_REG.some(r=>r.fecha===fecha&&r.maqNum===m.num);
    if(!tieneReg)return;
    TURNOS.forEach(t=>{
      DEMO_HORAS.push({id:uid(),maqNum:m.num,fecha,turno:t.id,horas:+(10+Math.random()*2).toFixed(1)});
    });
  });
});

// ── RESUMEN ───────────────────────────────────────────────────────────────────
function Resumen({registros,horas}){
  const [periodo,setPeriodo]=useState("dia");
  const [fechaRef,setFechaRef]=useState(HOY);

  // calcular rango según periodo
  const rango=useMemo(()=>{
    if(periodo==="dia") return {from:fechaRef, to:fechaRef, label:fmtDate(fechaRef)};
    if(periodo==="semana"){
      const from=weekStart(fechaRef);
      const to=addDays(from,6);
      return {from, to, label:`Semana ${fmtDate(from)} – ${fmtDate(to)}`};
    }
    // mes
    const mes=monthOf(fechaRef);
    const from=mes+"-01";
    const d=new Date(from+"T12:00:00"); d.setMonth(d.getMonth()+1); d.setDate(0);
    const to=d.toISOString().slice(0,10);
    return {from, to, label:fmtMonth(fechaRef)};
  },[periodo,fechaRef]);

  // días hábiles en el rango (días con al menos un registro)
  const diasEnRango=useMemo(()=>[...new Set(registros.filter(r=>dateInRange(r.fecha,rango.from,rango.to)).map(r=>r.fecha))],[registros,rango]);
  const cantDias=diasEnRango.length;

  // totales por máquina (con desglose por turno)
  const porMaquina=useMemo(()=>{
    const m={};
    MAQUINAS.forEach(mq=>{
      m[mq.num]={maqNum:mq.num,modelo:mq.modelo,grupo:mq.grupo,doble:mq.doble,
        prendas:0,paños:0,horasEncendido:0,diasActiva:new Set(),obs:0,
        turnos:{dia:{prendas:0,horas:0},noche:{prendas:0,horas:0}}};
    });
    registros.filter(r=>dateInRange(r.fecha,rango.from,rango.to)).forEach(r=>{
      const p=totalPaños(r.talles); const pr=toPrendas(p,r.articulo);
      m[r.maqNum].paños+=p;
      m[r.maqNum].prendas=+(m[r.maqNum].prendas+pr).toFixed(1);
      m[r.maqNum].diasActiva.add(r.fecha);
      if(r.obs)m[r.maqNum].obs++;
      if(m[r.maqNum].turnos[r.turno]!=null)
        m[r.maqNum].turnos[r.turno].prendas=+(m[r.maqNum].turnos[r.turno].prendas+pr).toFixed(1);
    });
    horas.filter(h=>dateInRange(h.fecha,rango.from,rango.to)).forEach(h=>{
      if(!m[h.maqNum])return;
      m[h.maqNum].horasEncendido=+(m[h.maqNum].horasEncendido+h.horas).toFixed(1);
      if(m[h.maqNum].turnos[h.turno]!=null)
        m[h.maqNum].turnos[h.turno].horas=+(m[h.maqNum].turnos[h.turno].horas+h.horas).toFixed(1);
    });
    Object.values(m).forEach(mq=>{ mq.diasActiva=mq.diasActiva.size; });
    return m;
  },[registros,horas,rango]);

  // totales por grupo (con desglose por turno)
  const porGrupo=useMemo(()=>{
    const g={};
    GRUPOS.forEach(gr=>{g[gr.id]={nombre:gr.nombre,prendas:0,maqsActivas:0,maqsParadas:0,turnos:{dia:{prendas:0},noche:{prendas:0}}};});
    Object.values(porMaquina).forEach(m=>{
      g[m.grupo].prendas=+(g[m.grupo].prendas+m.prendas).toFixed(1);
      g[m.grupo].turnos.dia.prendas=+(g[m.grupo].turnos.dia.prendas+m.turnos.dia.prendas).toFixed(1);
      g[m.grupo].turnos.noche.prendas=+(g[m.grupo].turnos.noche.prendas+m.turnos.noche.prendas).toFixed(1);
      if(m.prendas>0)g[m.grupo].maqsActivas++;
      else g[m.grupo].maqsParadas++;
    });
    return g;
  },[porMaquina]);

  const totalPrendas=+(Object.values(porMaquina).reduce((a,m)=>a+m.prendas,0)).toFixed(1);
  const maqsParadas=Object.values(porMaquina).filter(m=>m.prendas===0).length;
  const maqsActivas=MAQUINAS.length-maqsParadas;

  // fechas disponibles para picker
  const fechasDisp=[...new Set(registros.map(r=>r.fecha))].sort().reverse();
  const mesesDisp=[...new Set(fechasDisp.map(f=>f.slice(0,7)))].sort().reverse();

  return (
    <div>
      {/* selector periodo */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:20,marginBottom:20}}>
        <div style={{display:"flex",gap:16,alignItems:"flex-end",flexWrap:"wrap"}}>
          <Field label="Período">
            <div style={{display:"flex",gap:4,background:C.surface,borderRadius:6,padding:3,border:`1px solid ${C.border}`}}>
              {[["dia","Diario"],["semana","Semanal"],["mes","Mensual"]].map(([k,l])=>(
                <button key={k} onClick={()=>setPeriodo(k)} style={{
                  background:periodo===k?C.accent:"transparent",color:periodo===k?"#0f0e0d":C.muted,
                  border:"none",borderRadius:4,padding:"7px 18px",fontWeight:700,fontSize:13,
                  cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s",whiteSpace:"nowrap"
                }}>{l}</button>
              ))}
            </div>
          </Field>
          {periodo==="mes"?(
            <Field label="Mes">
              <select style={{...iSt,width:200}} value={monthOf(fechaRef)} onChange={e=>setFechaRef(e.target.value+"-01")}>
                {mesesDisp.map(m=><option key={m} value={m}>{fmtMonth(m+"-01")}</option>)}
              </select>
            </Field>
          ):(
            <Field label={periodo==="dia"?"Fecha":"Fecha de referencia (semana)"}>
              <select style={{...iSt,width:200}} value={fechaRef} onChange={e=>setFechaRef(e.target.value)}>
                {fechasDisp.map(f=><option key={f} value={f}>{fmtFechaConDia(f)}</option>)}
              </select>
            </Field>
          )}
          <div style={{fontSize:13,color:C.muted,paddingBottom:10}}>
            <strong style={{color:C.text}}>{rango.label}</strong>
            {cantDias>0&&<span style={{marginLeft:8}}>· {cantDias} día{cantDias!==1?"s":""} con actividad</span>}
          </div>
        </div>
      </div>

      {/* KPIs globales */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
        {[
          {label:"Total prendas",     value:totalPrendas,  color:C.success, sub:periodo!=="dia"&&cantDias>0?`${+(totalPrendas/cantDias).toFixed(1)} / día`:null},
          {label:"Máquinas activas",  value:maqsActivas,   color:C.accent,  sub:`de ${MAQUINAS.length} total`},
          {label:"Máquinas paradas",  value:maqsParadas,   color:maqsParadas>0?C.danger:C.muted, sub:maqsParadas>0?"sin producción":null},
        ].map(k=>(
          <div key={k.label} style={{background:C.card,border:`1px solid ${k.color==="C.danger"?C.danger:C.border}`,borderRadius:10,padding:20,textAlign:"center"}}>
            <div style={{fontSize:10,color:C.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}}>{k.label}</div>
            <div style={{fontSize:32,fontWeight:900,color:k.color,letterSpacing:"-0.02em"}}>{k.value}</div>
            {k.sub&&<div style={{fontSize:11,color:C.muted,marginTop:4}}>{k.sub}</div>}
          </div>
        ))}
      </div>

      {/* resumen por grupo */}
      <div style={{marginBottom:24}}>
        <div style={{fontSize:12,color:C.muted,marginBottom:10,letterSpacing:"0.06em",textTransform:"uppercase"}}>Total por grupo</div>
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
          <table style={{width:"100%",borderCollapse:"collapse"}}>
            <thead>
              <tr>
                {["Grupo","Turno Día","Turno Noche","Total prendas","Máqs activas","Máqs paradas"].map(h=><th key={h} style={thSt}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {GRUPOS.map(gr=>{
                const s=porGrupo[gr.id];
                const maxGrupo=Math.max(...Object.values(porGrupo).map(x=>x.prendas),1);
                const pct=s.prendas/maxGrupo;
                return (
                  <tr key={gr.id}>
                    <td style={{...tdSt,fontWeight:700,color:C.accent}}>{gr.nombre}</td>
                    <td style={{...tdSt,color:C.accent,fontWeight:600}}>{s.turnos.dia.prendas||"—"}</td>
                    <td style={{...tdSt,color:C.info,fontWeight:600}}>{s.turnos.noche.prendas||"—"}</td>
                    <td style={{...tdSt}}>
                      <div style={{display:"flex",alignItems:"center",gap:10}}>
                        <strong style={{color:C.success,fontSize:15}}>{s.prendas}</strong>
                        <div style={{flex:1,background:C.surface,borderRadius:3,height:6,overflow:"hidden",minWidth:80}}>
                          <div style={{height:"100%",width:`${pct*100}%`,background:C.success,borderRadius:3}}/>
                        </div>
                      </div>
                    </td>
                    <td style={{...tdSt,color:C.success,fontWeight:600}}>{s.maqsActivas}</td>
                    <td style={{...tdSt,color:s.maqsParadas>0?C.danger:C.muted,fontWeight:s.maqsParadas>0?700:400}}>
                      {s.maqsParadas>0?`⚠ ${s.maqsParadas}`:"—"}
                    </td>
                  </tr>
                );
              })}
              <tr style={{background:C.surface}}>
                <td style={{...tdSt,fontWeight:900,color:C.text}}>TOTAL</td>
                <td style={{...tdSt,fontWeight:700,color:C.accent}}>{+(Object.values(porGrupo).reduce((a,g)=>a+g.turnos.dia.prendas,0)).toFixed(1)}</td>
                <td style={{...tdSt,fontWeight:700,color:C.info}}>{+(Object.values(porGrupo).reduce((a,g)=>a+g.turnos.noche.prendas,0)).toFixed(1)}</td>
                <td style={{...tdSt,fontWeight:900,color:C.success,fontSize:16}}>{totalPrendas}</td>
                <td style={{...tdSt,fontWeight:700,color:C.success}}>{maqsActivas}</td>
                <td style={{...tdSt,fontWeight:700,color:maqsParadas>0?C.danger:C.muted}}>{maqsParadas>0?`⚠ ${maqsParadas}`:"—"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* tabla por máquina agrupada por modelo */}
      <div style={{fontSize:12,color:C.muted,marginBottom:10,letterSpacing:"0.06em",textTransform:"uppercase"}}>Detalle por máquina</div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:700}}>
          <thead>
            <tr>
              {["Maq","Modelo","Grupo","Turno Día","Turno Noche","Total","Hs enc.","Días","Obs.","Estado"].map(h=>(
                <th key={h} style={thSt}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GRUPOS.map(gr=>{
              const maqsGr=MAQUINAS.filter(m=>m.grupo===gr.id);
              const totalGr=+(maqsGr.reduce((a,m)=>a+(porMaquina[m.num]?.prendas||0),0)).toFixed(1);
              return [
                // fila de grupo
                <tr key={`gr-${gr.id}`} style={{background:C.surface}}>
                  <td colSpan={3} style={{...tdSt,fontWeight:800,color:C.accent,fontSize:12,letterSpacing:"0.05em",textTransform:"uppercase",padding:"8px 14px"}}>
                    {gr.nombre}
                  </td>
                  <td colSpan={2} style={{...tdSt,padding:"8px 14px"}}/>
                  <td style={{...tdSt,fontWeight:800,color:C.success,padding:"8px 14px"}}>{totalGr}</td>
                  <td colSpan={4} style={{...tdSt,padding:"8px 14px"}}/>
                </tr>,
                // filas de máquinas
                ...maqsGr.map(mq=>{
                  const s=porMaquina[mq.num];
                  const parada=s.prendas===0;
                  const maxGr=Math.max(...maqsGr.map(m=>porMaquina[m.num]?.prendas||0),1);
                  const pct=s.prendas/maxGr;
                  return (
                    <tr key={mq.num} style={{background:parada?C.danger+"0a":"transparent"}}>
                      <td style={{...tdSt,fontWeight:700,color:parada?C.danger:C.text}}>{mq.num}</td>
                      <td style={{...tdSt,fontSize:12,color:C.muted}}>{mq.modelo}</td>
                      <td style={{...tdSt,fontSize:11}}><Pill color={C.muted} text={gr.nombre}/></td>
                      <td style={{...tdSt,color:C.accent,fontWeight:600,fontSize:13}}>
                        {parada?"—":s.turnos.dia.prendas>0?<span>{s.turnos.dia.prendas}<span style={{fontSize:10,color:C.muted,marginLeft:4}}>{s.turnos.dia.horas>0?`${s.turnos.dia.horas}h`:""}</span></span>:"—"}
                      </td>
                      <td style={{...tdSt,color:C.info,fontWeight:600,fontSize:13}}>
                        {parada?"—":s.turnos.noche.prendas>0?<span>{s.turnos.noche.prendas}<span style={{fontSize:10,color:C.muted,marginLeft:4}}>{s.turnos.noche.horas>0?`${s.turnos.noche.horas}h`:""}</span></span>:"—"}
                      </td>
                      <td style={{...tdSt}}>
                        {parada?(
                          <span style={{color:C.danger,fontWeight:700,fontSize:12}}>Parada</span>
                        ):(
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <strong style={{color:C.success,minWidth:40}}>{s.prendas}</strong>
                            <div style={{flex:1,background:C.surface,borderRadius:2,height:5,overflow:"hidden",minWidth:50}}>
                              <div style={{height:"100%",width:`${pct*100}%`,background:C.success,borderRadius:2}}/>
                            </div>
                          </div>
                        )}
                      </td>
                      <td style={{...tdSt,color:C.info,fontSize:12}}>{s.horasEncendido>0?`${s.horasEncendido}h`:"—"}</td>
                      <td style={{...tdSt,color:C.muted,fontSize:12,textAlign:"center"}}>
                        {parada?<span style={{color:C.danger}}>0</span>:`${s.diasActiva}${cantDias>0?` / ${cantDias}`:""}`}
                      </td>
                      <td style={{...tdSt,color:s.obs>0?C.danger:C.muted,fontSize:12}}>
                        {s.obs>0?`⚠ ${s.obs}`:"—"}
                      </td>
                      <td style={{...tdSt}}>
                        {parada
                          ?<Pill color={C.danger} text="Parada"/>
                          :s.diasActiva===cantDias&&cantDias>0
                            ?<Pill color={C.success} text="Activa"/>
                            :<Pill color={C.warn} text="Parcial"/>
                        }
                      </td>
                    </tr>
                  );
                })
              ];
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── CONTROL DIARIO ────────────────────────────────────────────────────────────
function ControlDiario({registros,horas}){
  const fechas=[...new Set(registros.map(r=>r.fecha))].sort().reverse();
  const [fecha,setFecha]=useState(fechas[0]||"");
  const [vista,setVista]=useState("dia");
  const [grupoFiltro,setGrupoFiltro]=useState("G7");
  const del_dia=useMemo(()=>registros.filter(r=>r.fecha===fecha),[registros,fecha]);
  const horas_dia=useMemo(()=>horas.filter(h=>h.fecha===fecha),[horas,fecha]);
  const porMaquina=useMemo(()=>{
    const m={};
    del_dia.forEach(r=>{
      const key=r.maqNum;
      if(!m[key]){ const info=MAQUINAS.find(x=>x.num===key); m[key]={maqNum:key,modelo:info?.modelo||"",grupo:info?.grupo||"",lote:r.lote,prendas:0,paños:0,obs:[],turnos:{}}; }
      const p=totalPaños(r.talles); const pr=toPrendas(p,r.articulo);
      m[key].paños+=p; m[key].prendas=+(m[key].prendas+pr).toFixed(1);
      if(r.obs)m[key].obs.push({tejedor:r.tejedor,turno:r.turno,obs:r.obs});
      if(!m[key].turnos[r.turno])m[key].turnos[r.turno]={prendas:0,tejedor:null,horas:null};
      m[key].turnos[r.turno].prendas=+(m[key].turnos[r.turno].prendas+pr).toFixed(1);
      m[key].turnos[r.turno].tejedor=r.tejedor;
    });
    horas_dia.forEach(h=>{ if(!m[h.maqNum])return; if(!m[h.maqNum].turnos[h.turno])m[h.maqNum].turnos[h.turno]={prendas:0,tejedor:null,horas:h.horas}; else m[h.maqNum].turnos[h.turno].horas=h.horas; });
    Object.values(m).forEach(mq=>{ const totalH=Object.values(mq.turnos).reduce((a,t)=>a+(t.horas||0),0); mq.horasTotales=totalH; mq.eficiencia=totalH>0?+(mq.prendas/totalH).toFixed(2):null; });
    return m;
  },[del_dia,horas_dia]);
  const maquinasVista=vista==="dia"?Object.values(porMaquina):Object.values(porMaquina).filter(m=>m.grupo===grupoFiltro);
  const totalPrendas=+(maquinasVista.reduce((a,m)=>a+m.prendas,0)).toFixed(1);
  const totalHoras=maquinasVista.reduce((a,m)=>a+m.horasTotales,0);
  const efGlobal=totalHoras>0?+(totalPrendas/totalHoras).toFixed(2):null;
  const totalObs=maquinasVista.reduce((a,m)=>a+m.obs.length,0);
  const maxPrendas=Math.max(...maquinasVista.map(m=>m.prendas),1);
  return (
    <div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:20,marginBottom:20}}>
        <div style={{display:"flex",gap:16,alignItems:"flex-end",flexWrap:"wrap"}}>
          <Field label="Fecha"><select style={{...iSt,width:180}} value={fecha} onChange={e=>setFecha(e.target.value)}>{fechas.map(f=><option key={f} value={f}>{fmtFechaConDia(f)}</option>)}</select></Field>
          <Field label="Vista">
            <div style={{display:"flex",gap:4,background:C.surface,borderRadius:6,padding:3,border:`1px solid ${C.border}`}}>
              {[["dia","📅 Por día"],["grupo","🏭 Por grupo"]].map(([k,l])=>(
                <button key={k} onClick={()=>setVista(k)} style={{background:vista===k?C.accent:"transparent",color:vista===k?"#0f0e0d":C.muted,border:"none",borderRadius:4,padding:"6px 14px",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s",whiteSpace:"nowrap"}}>{l}</button>
              ))}
            </div>
          </Field>
          {vista==="grupo"&&<Field label="Grupo"><select style={{...iSt,width:200}} value={grupoFiltro} onChange={e=>setGrupoFiltro(e.target.value)}>{GRUPOS.map(g=><option key={g.id} value={g.id}>{g.nombre}</option>)}</select></Field>}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        {[{label:"Máqs activas",value:maquinasVista.length,color:C.accent},{label:"Total prendas",value:totalPrendas,color:C.success},{label:"Hs encendido",value:totalHoras>0?totalHoras+"h":"—",color:C.info},{label:"Prendas/hora",value:efGlobal??"—",color:efGlobal?C.success:C.muted}].map(k=>(
          <div key={k.label} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:18,textAlign:"center"}}>
            <div style={{fontSize:10,color:C.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}}>{k.label}</div>
            <div style={{fontSize:28,fontWeight:900,color:k.color,letterSpacing:"-0.02em"}}>{k.value}</div>
          </div>
        ))}
      </div>
      {totalObs>0&&<div style={{background:C.danger+"11",border:`1px solid ${C.danger}44`,borderRadius:8,padding:"10px 16px",marginBottom:16,fontSize:13,color:C.danger,fontWeight:600}}>⚠ {totalObs} observación{totalObs!==1?"es":""} registrada{totalObs!==1?"s":""} hoy</div>}
      {maquinasVista.length===0
        ?<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:40,textAlign:"center",color:C.muted}}>Sin registros para esta fecha</div>
        :(
          <div style={{display:"grid",gap:10}}>
            {maquinasVista.sort((a,b)=>b.prendas-a.prendas).map(m=>{
              const pct=m.prendas/maxPrendas;
              const barColor=m.obs.length>0?C.danger:m.eficiencia&&m.eficiencia>1.5?C.success:C.accent;
              return (
                <div key={m.maqNum} style={{background:C.card,border:`1px solid ${m.obs.length>0?C.danger:C.border}`,borderRadius:10,padding:16}}>
                  <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:16,alignItems:"start"}}>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,flexWrap:"wrap"}}>
                        <span style={{fontWeight:900,color:C.accent,fontSize:17}}>Maq {m.maqNum}</span>
                        <span style={{fontSize:12,color:C.text,fontWeight:600}}>{m.modelo}</span>
                        <span style={{fontSize:11,color:C.muted,background:C.surface,border:`1px solid ${C.border}`,borderRadius:4,padding:"2px 8px"}}>{GRUPOS.find(g=>g.id===m.grupo)?.nombre}</span>
                        {m.lote&&<span style={{fontSize:11,color:C.muted}}>Lote: <strong style={{color:C.text}}>{m.lote}</strong></span>}
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                        {TURNOS.map(t=>{ const td=m.turnos[t.id]; return (
                          <div key={t.id} style={{background:C.surface,borderRadius:6,padding:"8px 12px",border:`1px solid ${C.border}`}}>
                            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                              <span style={{fontSize:11,fontWeight:700,color:turnoColor(t.id)}}>{t.label}</span>
                              <span style={{fontSize:10,color:C.muted}}>{t.horario}</span>
                            </div>
                            {td?(<div style={{fontSize:12,color:C.muted,display:"grid",gap:2}}>
                              {td.tejedor&&<span>👤 <strong style={{color:C.text}}>{td.tejedor}</strong></span>}
                              <span>📦 <strong style={{color:C.success}}>{td.prendas}</strong> prendas</span>
                              <span>⏱ <strong style={{color:td.horas?C.info:C.muted}}>{td.horas!=null?td.horas+"h":"Sin horas"}</strong>
                                {td.horas&&td.prendas>0&&<span style={{color:C.muted,fontSize:11}}> · {(td.prendas/td.horas).toFixed(2)} pr/h</span>}
                              </span>
                            </div>):(<span style={{fontSize:11,color:C.muted}}>Sin actividad</span>)}
                          </div>
                        );})}
                      </div>
                    </div>
                    <div style={{textAlign:"right",minWidth:90}}>
                      <div style={{fontSize:30,fontWeight:900,color:C.success,lineHeight:1}}>{m.prendas}</div>
                      <div style={{fontSize:11,color:C.muted,marginTop:2}}>prendas</div>
                      {m.horasTotales>0&&<div style={{fontSize:11,color:C.info,marginTop:4}}>{m.horasTotales}h</div>}
                      {m.eficiencia&&<div style={{fontSize:13,color:C.success,fontWeight:700,marginTop:4}}>{m.eficiencia} pr/h</div>}
                    </div>
                  </div>
                  <div style={{background:C.surface,borderRadius:3,height:5,overflow:"hidden",marginTop:12}}>
                    <div style={{background:barColor,height:"100%",width:`${pct*100}%`,borderRadius:3,transition:"width 0.3s"}}/>
                  </div>
                  {m.obs.length>0&&(<div style={{marginTop:10,display:"flex",flexDirection:"column",gap:4}}>
                    {m.obs.map((o,i)=><div key={i} style={{background:C.danger+"11",border:`1px solid ${C.danger}33`,borderRadius:6,padding:"6px 10px",fontSize:12,color:C.danger}}>⚠ <strong>{o.tejedor}</strong> (Turno {TURNOS.find(t=>t.id===o.turno)?.label||o.turno}): {o.obs}</div>)}
                  </div>)}
                </div>
              );
            })}
          </div>
        )
      }
    </div>
  );
}

// ── CARGAR PRODUCCIÓN ─────────────────────────────────────────────────────────
// ── CARGAR PRODUCCIÓN (replica planilla física) ───────────────────────────────
const PIEZAS = ["Delantera","Espalda","Manga","Cuello"];

// Una fila editable de la planilla: nºorden, talle, cant por pieza
function FilaPlanilla({fila,onChange,onRemove,idx,defaultTejedor}){
  const set=(k,v)=>onChange(idx,{...fila,[k]:v});
  const inSt={background:C.surface,border:`1px solid ${C.border}`,color:C.text,borderRadius:4,padding:"5px 6px",fontSize:13,fontFamily:"inherit",outline:"none",width:"100%",boxSizing:"border-box"};
  return (
    <tr style={{background:idx%2===0?C.card:C.surface}}>
      <td style={{padding:"4px 6px",borderBottom:`1px solid ${C.border}`,fontSize:12,color:C.muted,textAlign:"center"}}>{idx+1}</td>
      <td style={{padding:"4px 6px",borderBottom:`1px solid ${C.border}`}}>
        <input style={inSt} value={fila.orden} onChange={e=>set("orden",e.target.value)} placeholder="B248"/>
      </td>
      <td style={{padding:"4px 6px",borderBottom:`1px solid ${C.border}`}}>
        <input style={inSt} value={fila.talle} onChange={e=>set("talle",e.target.value)} placeholder="52"/>
      </td>
      {PIEZAS.map(p=>(
        <td key={p} style={{padding:"4px 6px",borderBottom:`1px solid ${C.border}`}}>
          <input type="number" min="0" style={{...inSt,textAlign:"center",width:52}}
            value={fila[p]||""} onChange={e=>set(p,Number(e.target.value)||0)} placeholder="0"/>
        </td>
      ))}
      <td style={{padding:"4px 6px",borderBottom:`1px solid ${C.border}`}}>
        <input type="number" min="0" style={{...inSt,textAlign:"center",width:44,background:"#2a1a1a",borderColor:C.danger+"66"}}
          value={fila.fallados||""} onChange={e=>set("fallados",Number(e.target.value)||0)} placeholder="0"/>
      </td>
      <td style={{padding:"4px 6px",borderBottom:`1px solid ${C.border}`}}>
        <input type="number" min="0" style={{...inSt,textAlign:"center",width:44,background:"#2a1a1a",borderColor:C.danger+"66"}}
          value={fila.fueraMedida||""} onChange={e=>set("fueraMedida",Number(e.target.value)||0)} placeholder="0"/>
      </td>
      {/* Tejedor por fila */}
      <td style={{padding:"4px 6px",borderBottom:`1px solid ${C.border}`,minWidth:130}}>
        <select style={{...inSt,fontSize:12,padding:"4px 6px"}}
          value={fila.tejedor||defaultTejedor}
          onChange={e=>set("tejedor",e.target.value)}>
          {TEJEDORES.map(t=><option key={t}>{t}</option>)}
        </select>
      </td>

      <td style={{padding:"4px 6px",borderBottom:`1px solid ${C.border}`,textAlign:"center"}}>
        <button onClick={()=>onRemove(idx)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontSize:14,padding:2}}>✕</button>
      </td>
    </tr>
  );
}

function emptyFila(tejedor=''){ return {orden:"",talle:"",Delantera:0,Espalda:0,Manga:0,Cuello:0,fallados:0,fueraMedida:0,tejedor}; }

// Bloque de una máquina
function BloqueMaquina({maq,data,onChange}){
  const addFila=()=>onChange(maq.num,{...data,filas:[...data.filas,emptyFila(data.tejedor)]});
  const updateFila=(idx,fila)=>{ const f=[...data.filas]; f[idx]=fila; onChange(maq.num,{...data,filas:f}); };
  const removeFila=(idx)=>{ const f=data.filas.filter((_,i)=>i!==idx); onChange(maq.num,{...data,filas:f}); };
  const setField=(k,v)=>onChange(maq.num,{...data,[k]:v});

  const totalPorPieza={};
  PIEZAS.forEach(p=>{ totalPorPieza[p]=data.filas.reduce((a,f)=>a+(f[p]||0),0); });
  const totalFallados=data.filas.reduce((a,f)=>a+(f.fallados||0),0);
  const totalFueraMedida=data.filas.reduce((a,f)=>a+(f.fueraMedida||0),0);

  const thS={padding:"6px 8px",fontSize:10,fontWeight:700,color:C.muted,letterSpacing:"0.06em",textTransform:"uppercase",borderBottom:`2px solid ${C.border}`,textAlign:"center",whiteSpace:"nowrap"};

  return (
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden",marginBottom:16}}>
      {/* Header máquina */}
      <div style={{background:C.surface,borderBottom:`1px solid ${C.border}`,padding:"10px 16px",display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{fontWeight:900,color:C.accent,fontSize:16}}>Maq {maq.num}</span>
          <span style={{fontSize:12,color:C.muted}}>{maq.modelo}</span>
        </div>
        <div style={{display:"flex",gap:10,flex:1,flexWrap:"wrap"}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <label style={{fontSize:11,color:C.muted,fontWeight:700,whiteSpace:"nowrap"}}>Obs.:</label>
            <input style={{...iSt,padding:"5px 8px",fontSize:12,width:200}} value={data.obs} onChange={e=>setField("obs",e.target.value)} placeholder="Observaciones…"/>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
            <label style={{fontSize:11,color:C.info,fontWeight:700,whiteSpace:"nowrap"}}>⏱ Hs:</label>
            {[12,9,6].map(h=>(
              <button key={h} onClick={()=>setField("horas",data.horas===String(h)?"":String(h))}
                style={{
                  background:data.horas===String(h)?C.info:C.surface,
                  color:data.horas===String(h)?"#0f0e0d":C.muted,
                  border:`1px solid ${data.horas===String(h)?C.info:C.border}`,
                  borderRadius:5,padding:"4px 10px",fontWeight:700,fontSize:12,
                  cursor:"pointer",fontFamily:"inherit",transition:"all 0.12s"
                }}>{h}h</button>
            ))}
            <input type="number" min="0" max="12" step="0.5"
              style={{...iSt,padding:"4px 6px",fontSize:12,fontWeight:700,width:60,
                textAlign:"center",color:C.info,
                border:`1px solid ${data.horas&&!["12","9","6"].includes(data.horas)?C.info:C.border}`}}
              value={["12","9","6"].includes(data.horas)?"":data.horas||""}
              onChange={e=>setField("horas",e.target.value)}
              placeholder="Otro"/>
          </div>
        </div>
        {/* totales rápidos */}
        <div style={{display:"flex",gap:12,fontSize:12}}>
          {PIEZAS.filter(p=>totalPorPieza[p]>0).map(p=>(
            <span key={p} style={{color:C.muted}}>{p}: <strong style={{color:C.text}}>{totalPorPieza[p]}</strong></span>
          ))}
          {totalFallados>0&&<span style={{color:C.danger}}>Fall: <strong>{totalFallados}</strong></span>}
        </div>
      </div>

      {/* Tabla de filas */}
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:500}}>
          <thead>
            <tr style={{background:C.surface}}>
              <th style={{...thS,width:28}}>#</th>
              <th style={{...thS,width:70}}>Nº Orden</th>
              <th style={{...thS,width:50}}>Talle</th>
              <th style={{...thS,background:C.success+"22",color:C.success}}>Delant.</th>
              <th style={{...thS,background:C.info+"22",color:C.info}}>Espalda</th>
              <th style={{...thS,background:C.accent+"22",color:C.accent}}>Manga</th>
              <th style={{...thS,background:C.muted+"22"}}>Cuello</th>
              <th style={{...thS,background:C.danger+"22",color:C.danger,width:52}}>Fall.</th>
              <th style={{...thS,background:C.danger+"22",color:C.danger,width:52}}>F.Med</th>
              <th style={{...thS,width:120}}>Tejedor</th>
              <th style={{...thS,width:90}}>Firma</th>
              <th style={{...thS,width:28}}></th>
            </tr>
          </thead>
          <tbody>
            {data.filas.map((f,i)=>(
              <FilaPlanilla key={i} fila={f} idx={i} onChange={updateFila} onRemove={removeFila} defaultTejedor={data.tejedor}/>
            ))}
            {/* fila totales */}
            {data.filas.length>0&&(
              <tr style={{background:C.surface,fontWeight:700}}>
                <td colSpan={3} style={{padding:"5px 8px",fontSize:11,color:C.muted,fontWeight:700}}>TOTAL</td>
                {PIEZAS.map(p=><td key={p} style={{padding:"5px 6px",textAlign:"center",fontSize:13,color:C.success,fontWeight:700}}>{totalPorPieza[p]||"—"}</td>)}
                <td style={{padding:"5px 6px",textAlign:"center",fontSize:13,color:C.danger,fontWeight:700}}>{totalFallados||"—"}</td>
                <td style={{padding:"5px 6px",textAlign:"center",fontSize:13,color:C.danger,fontWeight:700}}>{totalFueraMedida||"—"}</td>
                <td colSpan={3}/>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div style={{padding:"8px 12px"}}>
        <button onClick={addFila} style={{background:"none",border:`1px dashed ${C.border}`,color:C.muted,borderRadius:6,padding:"6px 14px",cursor:"pointer",fontSize:12,fontFamily:"inherit",width:"100%"}}>
          + Agregar renglón
        </button>
      </div>
    </div>
  );
}

function initDataGrupo(grupo){
  const d={};
  MAQUINAS.filter(m=>m.grupo===grupo).forEach(m=>{
    d[m.num]={tejedor:TEJEDORES[0],articulo:"",obs:"",horas:"",filas:[emptyFila(TEJEDORES[0]),emptyFila(TEJEDORES[0]),emptyFila(TEJEDORES[0])]};
  });
  return d;
}

function CargarForm({onAdd,onAddHoras}){
  const hoy=new Date().toISOString().slice(0,10);
  const [grupo,setGrupo]=useState("G10");
  const [turno,setTurno]=useState("dia");
  const [fecha,setFecha]=useState(hoy);
  const [horasEnc,setHorasEnc]=useState({});
  const [data,setData]=useState(()=>initDataGrupo("G10"));
  const [saved,setSaved]=useState(false);

  const handleGrupo=(g)=>{ setGrupo(g); setData(initDataGrupo(g)); setHorasEnc({}); };
  const updateMaq=(num,d)=>setData(p=>({...p,[num]:d}));

  const maqsGrupo=MAQUINAS.filter(m=>m.grupo===grupo);
  const turnoInfo=TURNOS.find(t=>t.id===turno);

  // Calcular total de prendas del grupo para mostrar
  const totalGrupo=maqsGrupo.reduce((acc,m)=>{
    const d=data[m.num]; if(!d)return acc;
    PIEZAS.forEach(p=>{ acc+=d.filas.reduce((a,f)=>a+(f[p]||0),0); });
    return acc;
  },0);

  const guardarTodo=()=>{
    const registros=[];
    maqsGrupo.forEach(maq=>{
      const d=data[maq.num]; if(!d)return;
      d.filas.forEach(fila=>{
        const cant=PIEZAS.reduce((a,p)=>a+(fila[p]||0),0);
        if(!cant&&!fila.orden)return;
        PIEZAS.forEach(pieza=>{
          if(!fila[pieza])return;
          registros.push({
            id:uid(), lote:fila.orden||"—", maqNum:maq.num,
            fecha, tejedor:fila.tejedor||d.tejedor, turno, articulo:"estandar",
            pieza, talle:fila.talle||"—",
            cantidad:fila[pieza],
            fallados:fila.fallados||0, fueraMedida:fila.fueraMedida||0,
            firma:fila.firma||"",
            obs:d.obs,
            // compatibilidad con sistema anterior
            talles:emptyT(),
          });
        });
      });
    });
    registros.forEach(r=>onAdd(r));
    // Guardar horas de cada máquina
    const horasEntradas=[];
    maqsGrupo.forEach(maq=>{
      const d=data[maq.num];
      if(d&&d.horas&&Number(d.horas)>0){
        horasEntradas.push({id:uid(),maqNum:maq.num,fecha,turno,horas:Number(d.horas)});
      }
    });
    if(horasEntradas.length>0&&onAddHoras) onAddHoras(horasEntradas,fecha,turno);
    setSaved(true); setTimeout(()=>setSaved(false),3000);
    setData(initDataGrupo(grupo));
  };

  return (
    <div style={{display:"grid",gap:0}}>
      {/* Selector global */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:20,marginBottom:20}}>
        <div style={{fontSize:12,color:C.muted,marginBottom:14,letterSpacing:"0.06em",textTransform:"uppercase"}}>Transcribir planilla física</div>
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr",gap:12,marginBottom:0}}>
          <Field label="Grupo de Máquinas">
            <select style={iSt} value={grupo} onChange={e=>handleGrupo(e.target.value)}>
              {GRUPOS.map(g=><option key={g.id} value={g.id}>{g.nombre} — Maqs: {MAQUINAS.filter(m=>m.grupo===g.id).map(m=>m.num).join(", ")}</option>)}
            </select>
          </Field>
          <Field label="Turno" sub={turnoInfo?.horario}>
            <select style={iSt} value={turno} onChange={e=>setTurno(e.target.value)}>
              {TURNOS.map(t=><option key={t.id} value={t.id}>{t.label} — {t.horario}</option>)}
            </select>
          </Field>
          <Field label="Fecha">
            <input type="date" style={iSt} value={fecha} onChange={e=>setFecha(e.target.value)}/>
          </Field>
        </div>
      </div>

      {/* Bloques por máquina */}
      {maqsGrupo.map(maq=>(
        <BloqueMaquina key={maq.num} maq={maq} data={data[maq.num]||{tejedor:TEJEDORES[0],articulo:"",obs:"",filas:[]}} onChange={updateMaq}/>
      ))}

      {/* Guardar todo */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{fontSize:13,color:C.muted}}>
          Total prendas cargadas: <strong style={{color:C.success,fontSize:16}}>{totalGrupo}</strong>
        </div>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          {saved&&<span style={{color:C.success,fontSize:13,fontWeight:600}}>✓ Planilla guardada</span>}
          <button onClick={guardarTodo} style={{
            background:totalGrupo>0?C.accent:"#333",color:totalGrupo>0?"#0f0e0d":"#666",
            border:"none",borderRadius:6,padding:"11px 32px",fontWeight:800,fontSize:14,
            cursor:totalGrupo>0?"pointer":"not-allowed",fontFamily:"inherit",transition:"all 0.15s"
          }}>Guardar planilla completa</button>
        </div>
      </div>
    </div>
  );
}

// ── CARGAR HORAS ──────────────────────────────────────────────────────────────
function CargarHoras({horas,onSave}){
  const hoy=new Date().toISOString().slice(0,10);
  const [fecha,setFecha]=useState(hoy);
  const [turno,setTurno]=useState("dia");
  const [vals,setVals]=useState(()=>{const o={};MAQUINAS.forEach(m=>{o[m.num]="";});return o;});
  const [saved,setSaved]=useState(false);
  const turnoInfo=TURNOS.find(t=>t.id===turno);
  const prefill=()=>{ const o={}; MAQUINAS.forEach(m=>{ const h=horas.find(x=>x.maqNum===m.num&&x.fecha===fecha&&x.turno===turno); o[m.num]=h?h.horas:""; }); setVals(o); };
  const completados=Object.values(vals).filter(v=>v!=="").length;
  const submit=()=>{ const entradas=MAQUINAS.filter(m=>vals[m.num]!=="").map(m=>({id:uid(),maqNum:m.num,fecha,turno,horas:Number(vals[m.num])})); if(!entradas.length)return; onSave(entradas,fecha,turno); setSaved(true); setTimeout(()=>setSaved(false),2500); };
  return (
    <div style={{display:"grid",gap:18}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr auto",gap:12,alignItems:"end"}}>
        <Field label="Fecha"><input type="date" style={iSt} value={fecha} onChange={e=>{setFecha(e.target.value);setVals(o=>{const n={};MAQUINAS.forEach(m=>{n[m.num]="";}); return n;});}}/></Field>
        <Field label="Turno" sub={turnoInfo?.horario}><select style={iSt} value={turno} onChange={e=>{setTurno(e.target.value);setVals(o=>{const n={};MAQUINAS.forEach(m=>{n[m.num]="";}); return n;});}}>{TURNOS.map(t=><option key={t.id} value={t.id}>{t.label} — {t.horario}</option>)}</select></Field>
        <button onClick={prefill} style={{background:C.surface,color:C.text,border:`1px solid ${C.border}`,borderRadius:6,padding:"9px 16px",fontWeight:700,cursor:"pointer",fontFamily:"inherit",fontSize:13,whiteSpace:"nowrap"}}>Cargar existentes</button>
      </div>
      {GRUPOS.map(g=>{ const maqsGr=MAQUINAS.filter(m=>m.grupo===g.id); return (
        <div key={g.id} style={{background:C.surface,borderRadius:8,padding:16,border:`1px solid ${C.border}`}}>
          <div style={{fontSize:11,fontWeight:700,color:C.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:12}}>{g.nombre}</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(110px,1fr))",gap:10}}>
            {maqsGr.map(m=>{ const v=Number(vals[m.num])||0; const pct=v/12; const col=pct>=1?C.success:pct>=0.7?C.accent:pct>0?C.warn:C.border; return (
              <div key={m.num} style={{display:"flex",flexDirection:"column",gap:4}}>
                <label style={{fontSize:10,fontWeight:700,color:C.muted,textAlign:"center",lineHeight:1.3}}>Maq {m.num}<br/><span style={{fontSize:9,fontWeight:400}}>{m.modelo}</span></label>
                <input type="number" min="0" max={12} step="0.5" style={{...iSt,padding:"6px 4px",textAlign:"center",fontSize:14,fontWeight:700,border:`1px solid ${vals[m.num]!==""?col:C.border}`}} value={vals[m.num]} onChange={e=>setVals(p=>({...p,[m.num]:e.target.value}))} placeholder="—"/>
                {vals[m.num]!==""&&<div style={{height:3,background:C.border,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(pct,1)*100}%`,background:col,borderRadius:2}}/></div>}
              </div>
            );})}
          </div>
        </div>
      );})}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:12,color:C.muted}}>{completados} de {MAQUINAS.length} máquinas completadas</span>
        <div style={{display:"flex",gap:12,alignItems:"center"}}>
          {saved&&<span style={{color:C.success,fontSize:13,fontWeight:600}}>✓ Horas guardadas</span>}
          <button onClick={submit} style={{background:completados>0?C.accent:"#333",color:completados>0?"#0f0e0d":"#666",border:"none",borderRadius:6,padding:"10px 28px",fontWeight:800,fontSize:14,cursor:completados>0?"pointer":"not-allowed",fontFamily:"inherit",letterSpacing:"0.04em",transition:"all 0.15s"}}>Guardar horas</button>
        </div>
      </div>
    </div>
  );
}

// ── CONSULTAR ─────────────────────────────────────────────────────────────────
function Consultar({registros}){
  const [fLote,setFLote]=useState(""); const [fTejedor,setFTejedor]=useState(""); const [fGrupo,setFGrupo]=useState(""); const [fMaq,setFMaq]=useState("");
  const maqsGr=fGrupo?MAQUINAS.filter(m=>m.grupo===fGrupo):[];
  const filtered=useMemo(()=>registros.filter(r=>{ if(fLote&&!r.lote.toLowerCase().includes(fLote.toLowerCase()))return false; if(fTejedor&&r.tejedor!==fTejedor)return false; if(fGrupo&&MAQUINAS.find(m=>m.num===r.maqNum)?.grupo!==fGrupo)return false; if(fMaq&&r.maqNum!==Number(fMaq))return false; return true; }),[registros,fLote,fTejedor,fGrupo,fMaq]);
  const resumen=useMemo(()=>{ const m={}; filtered.forEach(r=>{ if(!m[r.tejedor])m[r.tejedor]={paños:0,prendas:0,obs:0,maqs:{}}; const p=totalPaños(r.talles); m[r.tejedor].paños+=p; m[r.tejedor].prendas=+(m[r.tejedor].prendas+toPrendas(p,r.articulo)).toFixed(1); if(r.obs)m[r.tejedor].obs++; const mk=`Maq ${r.maqNum}`; m[r.tejedor].maqs[mk]=(m[r.tejedor].maqs[mk]||0)+toPrendas(p,r.articulo); }); return m; },[filtered]);
  const hasF=fLote||fTejedor||fGrupo||fMaq;
  return (
    <div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:20,marginBottom:20}}>
        <div style={{fontSize:12,color:C.muted,marginBottom:12,letterSpacing:"0.06em",textTransform:"uppercase"}}>Filtros</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
          <Field label="Lote"><input style={iSt} value={fLote} onChange={e=>setFLote(e.target.value)} placeholder="L-001"/></Field>
          <Field label="Tejedor"><select style={iSt} value={fTejedor} onChange={e=>setFTejedor(e.target.value)}><option value="">Todos</option>{TEJEDORES.map(t=><option key={t}>{t}</option>)}</select></Field>
          <Field label="Grupo"><select style={iSt} value={fGrupo} onChange={e=>{setFGrupo(e.target.value);setFMaq("");}}><option value="">Todos</option>{GRUPOS.map(g=><option key={g.id} value={g.id}>{g.nombre}</option>)}</select></Field>
          <Field label="Máquina"><select style={iSt} value={fMaq} onChange={e=>setFMaq(e.target.value)} disabled={!fGrupo}><option value="">Todas</option>{maqsGr.map(m=><option key={m.num} value={m.num}>Maq {m.num} — {m.modelo}</option>)}</select></Field>
        </div>
      </div>
      {hasF&&Object.keys(resumen).length>0&&(
        <div style={{marginBottom:20}}>
          <div style={{fontSize:12,color:C.muted,marginBottom:10,letterSpacing:"0.06em",textTransform:"uppercase"}}>Responsabilidad por tejedor</div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(210px,1fr))",gap:12}}>
            {Object.entries(resumen).map(([tej,s])=>(
              <div key={tej} style={{background:C.card,borderRadius:8,padding:16,border:`1px solid ${s.obs>0?C.danger:C.border}`}}>
                <div style={{fontWeight:800,color:C.accent,fontSize:15,marginBottom:8}}>{tej}</div>
                {Object.entries(s.maqs).map(([maq,pr])=><div key={maq} style={{fontSize:12,color:C.muted,marginBottom:2}}>{maq}: <strong style={{color:C.text}}>{pr} prendas</strong></div>)}
                <div style={{borderTop:`1px solid ${C.border}`,paddingTop:8,marginTop:8,display:"flex",justifyContent:"space-between",fontSize:12}}>
                  <span style={{color:C.muted}}>Total: <strong style={{color:C.success}}>{s.prendas}</strong></span>
                  {s.obs>0&&<span style={{color:C.danger,fontWeight:700}}>⚠ {s.obs} obs.</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div style={{fontSize:12,color:C.muted,marginBottom:10,letterSpacing:"0.06em",textTransform:"uppercase"}}>{filtered.length} registro{filtered.length!==1?"s":""} encontrado{filtered.length!==1?"s":""}</div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,overflow:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",minWidth:800}}>
          <thead><tr>{["Lote","Máquina","Fecha","Tejedor","Artículo","Detalle talles","Paños","Prendas","Turno","Obs."].map(h=><th key={h} style={thSt}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.length===0?<tr><td colSpan={10} style={{...tdSt,textAlign:"center",color:C.muted,padding:40}}>Sin resultados</td></tr>
              :filtered.slice(0,50).map(r=>{
                const maqInfo=MAQUINAS.find(m=>m.num===r.maqNum);
                const paños=totalPaños(r.talles); const prendas=toPrendas(paños,r.articulo);
                const det=Object.entries(r.talles).filter(([,v])=>v>0).map(([id,v])=>{ const t=TALLES.find(x=>x.id===id); return `${t?.label||id}:${v}`; }).join(" · ");
                const tc=turnoColor(r.turno); const tl=TURNOS.find(t=>t.id===r.turno);
                return (<tr key={r.id}>
                  <td style={tdSt}>{r.lote}</td>
                  <td style={tdSt}><strong>Maq {r.maqNum}</strong><br/><span style={{fontSize:11,color:C.muted}}>{maqInfo?.modelo}</span></td>
                  <td style={tdSt}>{fmtDate(r.fecha)}</td>
                  <td style={{...tdSt,fontWeight:700,color:C.accent}}>{r.tejedor}</td>
                  <td style={{...tdSt,fontSize:12,color:C.muted}}>{ARTICULOS.find(a=>a.id===r.articulo)?.nombre}</td>
                  <td style={{...tdSt,fontSize:11,color:C.muted,maxWidth:200}}>{det}</td>
                  <td style={{...tdSt,textAlign:"right",fontWeight:700}}>{paños}</td>
                  <td style={{...tdSt,textAlign:"right",color:C.success,fontWeight:600}}>{prendas}</td>
                  <td style={tdSt}><Pill color={tc} text={tl?.label||r.turno}/></td>
                  <td style={{...tdSt,color:r.obs?C.danger:C.muted,fontSize:12}}>{r.obs||"—"}</td>
                </tr>);
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── PLANILLA ──────────────────────────────────────────────────────────────────
function TurnoRecuadro(){
  return (
    <div style={{border:"2px solid #000",borderRadius:3,padding:"4px 8px",display:"inline-flex",alignItems:"center",gap:10}}>
      <span style={{fontWeight:900,fontSize:8,textTransform:"uppercase",letterSpacing:"0.05em",marginRight:4}}>Turno:</span>
      <div style={{display:"flex",alignItems:"center",gap:3}}>
        <div style={{width:13,height:13,border:"1.5px solid #000",borderRadius:2,flexShrink:0}}/>
        <span style={{fontSize:9,fontWeight:700}}>Día</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:3}}>
        <div style={{width:13,height:13,border:"1.5px solid #000",borderRadius:2,flexShrink:0}}/>
        <span style={{fontSize:9,fontWeight:700}}>Noche</span>
      </div>
    </div>
  );
}

function PlanillaView(){
  const [cfg,setCfg]=useState({grupo:"G10",fecha:new Date().toISOString().slice(0,10)});
  const [show,setShow]=useState(false);
  const set=(k,v)=>setCfg(p=>({...p,[k]:v}));
  const grupo=GRUPOS.find(g=>g.id===cfg.grupo);
  const maqsGrupo=MAQUINAS.filter(m=>m.grupo===cfg.grupo);

  const bSt={border:"1px solid #555"};
  const cell=(extra={})=>({...bSt,padding:"3px 4px",fontSize:8,...extra});
  const hCell=(extra={})=>({...bSt,padding:"4px 3px",fontSize:7.5,fontWeight:700,background:"#d8d8d8",textAlign:"center",...extra});
  const ROWS=10;

  return (
    <div style={{display:"grid",gap:20}}>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:20}}>
        <div style={{fontSize:12,color:C.muted,marginBottom:14,letterSpacing:"0.06em",textTransform:"uppercase"}}>Configurar planilla imprimible</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
          <Field label="Grupo de Máquinas">
            <select style={iSt} value={cfg.grupo} onChange={e=>set("grupo",e.target.value)}>
              {GRUPOS.map(g=><option key={g.id} value={g.id}>{g.nombre} — Maqs: {MAQUINAS.filter(m=>m.grupo===g.id).map(m=>m.num).join(", ")}</option>)}
            </select>
          </Field>
          <Field label="Fecha">
            <input type="date" style={iSt} value={cfg.fecha} onChange={e=>set("fecha",e.target.value)}/>
          </Field>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <button onClick={()=>setShow(true)} style={{background:C.surface,color:C.text,border:`1px solid ${C.border}`,borderRadius:6,padding:"9px 20px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>👁 Previsualizar</button>
          {show&&<button onClick={()=>window.print()} style={{background:C.accent,color:"#0f0e0d",border:"none",borderRadius:6,padding:"9px 20px",fontWeight:800,cursor:"pointer",fontFamily:"inherit"}}>🖨 Imprimir</button>}
        </div>
      </div>

      {show&&(
        <div style={{background:"white",color:"#000",fontFamily:"Arial,sans-serif",fontSize:8,borderRadius:10,padding:"14px 12px"}}>

          {/* ── ENCABEZADO GLOBAL ── */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"2px solid #000",paddingBottom:7,marginBottom:10}}>
            <div>
              <div style={{fontWeight:900,fontSize:14}}>PLANILLA DE TEJEDORES</div>
              <div style={{fontSize:9,color:"#444",marginTop:2}}>{grupo?.nombre} &nbsp;·&nbsp; Máqs: {maqsGrupo.map(m=>m.num).join(", ")}</div>
            </div>
            <div style={{display:"flex",gap:16,alignItems:"center"}}>
              {/* Turno */}
              <div style={{border:"2px solid #000",borderRadius:4,padding:"5px 10px"}}>
                <div style={{fontWeight:900,fontSize:8,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:5}}>Turno</div>
                <div style={{display:"flex",gap:10}}>
                  {["Día  7:30→19:30","Noche  19:30→7:30"].map(t=>(
                    <div key={t} style={{display:"flex",alignItems:"center",gap:4}}>
                      <div style={{width:13,height:13,border:"1.5px solid #000",borderRadius:2}}/>
                      <span style={{fontSize:9,fontWeight:700}}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Tejedor */}
              <div style={{fontSize:9}}>
                <div style={{fontWeight:700,marginBottom:3}}>Tejedor:</div>
                <div style={{borderBottom:"1px solid #000",width:160,height:16}}/>
              </div>
              {/* Fecha */}
              <div style={{fontSize:9,textAlign:"right"}}>
                <div style={{fontWeight:700,marginBottom:3}}>Fecha:</div>
                <div style={{fontWeight:400}}>{cfg.fecha?fmtDate(cfg.fecha):"___ / ___ / ______"}</div>
              </div>
            </div>
          </div>

          {/* ── BLOQUES POR MÁQUINA EN COLUMNAS ── */}
          <div style={{display:"grid",gridTemplateColumns:`repeat(${maqsGrupo.length},1fr)`,gap:8}}>
            {maqsGrupo.map(maq=>(
              <div key={maq.num} style={{border:"1.5px solid #000",borderRadius:2}}>

                {/* Header máquina */}
                <div style={{background:"#222",color:"#fff",padding:"4px 7px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontWeight:900,fontSize:11}}>Maq {maq.num}</span>
                  <span style={{fontSize:8,opacity:0.8}}>{maq.modelo}</span>
                </div>

                {/* Artículo */}
                <div style={{padding:"4px 6px",borderBottom:"1px solid #999",fontSize:8,display:"flex",gap:6}}>
                  <span style={{fontWeight:700}}>Artículo:</span>
                  <span style={{borderBottom:"1px solid #999",flex:1}}/>
                </div>

                {/* Sub-encabezado piezas */}
                <table style={{width:"100%",borderCollapse:"collapse"}}>
                  <thead>
                    <tr>
                      <th style={hCell({width:28,borderTop:"none",borderLeft:"none"})}>Nº Ord.</th>
                      {/* Delantera */}
                      <th style={hCell({background:"#c8e6c9"})} colSpan={2}>Delantera</th>
                      {/* Espalda */}
                      <th style={hCell({background:"#bbdefb"})} colSpan={2}>Espalda</th>
                      {/* Manga */}
                      <th style={hCell({background:"#ffe0b2"})} colSpan={2}>Manga</th>
                      {/* Fallados */}
                      <th style={hCell({background:"#ffcdd2",width:28})}>Fall.</th>
                      <th style={hCell({background:"#ffcdd2",width:28})}>F.Med</th>
                      <th style={hCell({background:"#e8e8e8",width:60})}>Tejedor</th>
                      <th style={hCell({background:"#e8e8e8",width:50})}>Firma</th>
                    </tr>
                    <tr>
                      <th style={hCell({fontWeight:400,background:"#eee",borderTop:"none",borderLeft:"none"})}></th>
                      <th style={hCell({fontWeight:600,background:"#e8f5e9",fontSize:7})}>Talle</th>
                      <th style={hCell({fontWeight:600,background:"#e8f5e9",fontSize:7})}>Cant.</th>
                      <th style={hCell({fontWeight:600,background:"#e3f2fd",fontSize:7})}>Talle</th>
                      <th style={hCell({fontWeight:600,background:"#e3f2fd",fontSize:7})}>Cant.</th>
                      <th style={hCell({fontWeight:600,background:"#fff3e0",fontSize:7})}>Talle</th>
                      <th style={hCell({fontWeight:600,background:"#fff3e0",fontSize:7})}>Cant.</th>
                      <th style={hCell({fontWeight:400,background:"#ffebee",fontSize:7,borderTop:"none"})}></th>
                      <th style={hCell({fontWeight:400,background:"#ffebee",fontSize:7,borderTop:"none"})}></th>
                      <th style={hCell({fontWeight:400,background:"#efefef",fontSize:7,borderTop:"none"})}></th>
                      <th style={hCell({fontWeight:400,background:"#efefef",fontSize:7,borderTop:"none"})}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({length:ROWS}).map((_,i)=>(
                      <tr key={i} style={{height:18,background:i%2===0?"#fff":"#fafafa"}}>
                        <td style={cell({textAlign:"center",borderLeft:"none"})}></td>
                        <td style={cell({background:"#f9fff9"})}></td>
                        <td style={cell({background:"#f9fff9"})}></td>
                        <td style={cell({background:"#f0f8ff"})}></td>
                        <td style={cell({background:"#f0f8ff"})}></td>
                        <td style={cell({background:"#fffaf0"})}></td>
                        <td style={cell({background:"#fffaf0"})}></td>
                        <td style={cell({background:"#fff5f5"})}></td>
                        <td style={cell({background:"#fff5f5"})}></td>
                        <td style={cell({background:"#f8f8f8"})}></td>
                        <td style={cell({background:"#f8f8f8",borderRight:"none"})}></td>
                      </tr>
                    ))}
                    {/* Fila totales */}
                    <tr style={{background:"#e8e8e8",height:18}}>
                      <td style={cell({fontWeight:700,fontSize:7,textAlign:"center",borderLeft:"none",borderTop:"1.5px solid #999"})}>TOTAL</td>
                      <td style={cell({borderTop:"1.5px solid #999",background:"#e8f5e9"})}></td>
                      <td style={cell({borderTop:"1.5px solid #999",background:"#e8f5e9",fontWeight:700})}></td>
                      <td style={cell({borderTop:"1.5px solid #999",background:"#e3f2fd"})}></td>
                      <td style={cell({borderTop:"1.5px solid #999",background:"#e3f2fd",fontWeight:700})}></td>
                      <td style={cell({borderTop:"1.5px solid #999",background:"#fff3e0"})}></td>
                      <td style={cell({borderTop:"1.5px solid #999",background:"#fff3e0",fontWeight:700})}></td>
                      <td style={cell({borderTop:"1.5px solid #999",background:"#ffebee",fontWeight:700})}></td>
                      <td style={cell({borderTop:"1.5px solid #999",background:"#ffebee",fontWeight:700,borderRight:"none"})}></td>
                    </tr>
                    {/* Fila cierre admin */}
                    <tr style={{background:"#f0f0f0",height:18}}>
                      <td colSpan={7} style={cell({fontWeight:700,fontSize:7,textAlign:"left",paddingLeft:5,borderLeft:"none",borderTop:"1.5px solid #666",background:"#e8e8e8"})}>
                        Hs encendido: ________
                      </td>
                      <td colSpan={2} style={cell({fontSize:7,textAlign:"left",paddingLeft:3,borderTop:"1.5px solid #666",background:"#e8e8e8",borderRight:"none"})}>
                        Firma admin:
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          {/* ── PIE ── */}
          <div style={{marginTop:8,fontSize:7,color:"#888",borderTop:"1px solid #ddd",paddingTop:4,display:"flex",justifyContent:"space-between"}}>
            <span>Completar con bolígrafo · Un renglón por orden · Prendas = Paños ÷ 4 (Bufanda/Ruana/Chalina: 1 paño = 1 prenda)</span>
            <span>Admin completa Hs encendido y firma al cerrar el turno</span>
          </div>
        </div>
      )}
    </div>
  );
}


// ── CARGAR ENVIOS ─────────────────────────────────────────────────────────────
function CargarEnvios({envios,onAdd}){
  const hoy=new Date().toISOString().slice(0,10);
  const [f,setF]=useState({fecha:hoy,negocio:"",outlet:"",terceros:"",obs:""});
  const [saved,setSaved]=useState(false);
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const total=(Number(f.negocio)||0)+(Number(f.outlet)||0)+(Number(f.terceros)||0);
  const canSave=total>0;
  const submit=()=>{
    if(!canSave)return;
    onAdd({id:uid(),fecha:f.fecha,negocio:Number(f.negocio)||0,outlet:Number(f.outlet)||0,terceros:Number(f.terceros)||0,obs:f.obs});
    setSaved(true); setTimeout(()=>setSaved(false),2000);
    setF(p=>({...p,negocio:"",outlet:"",terceros:"",obs:""}));
  };
  const ultimos=[...envios].sort((a,b)=>b.fecha.localeCompare(a.fecha)).slice(0,8);
  return (
    <div style={{display:"grid",gap:20}}>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:24}}>
        <div style={{fontSize:12,color:C.muted,marginBottom:16,letterSpacing:"0.06em",textTransform:"uppercase"}}>Registrar envíos del día</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:12,marginBottom:14}}>
          <Field label="Fecha"><input type="date" style={iSt} value={f.fecha} onChange={e=>set("fecha",e.target.value)}/></Field>
          <Field label="Negocio"><input type="number" min="0" style={iSt} value={f.negocio} onChange={e=>set("negocio",e.target.value)} placeholder="0"/></Field>
          <Field label="Outlet"><input type="number" min="0" style={iSt} value={f.outlet} onChange={e=>set("outlet",e.target.value)} placeholder="0"/></Field>
          <Field label="3os"><input type="number" min="0" style={iSt} value={f.terceros} onChange={e=>set("terceros",e.target.value)} placeholder="0"/></Field>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:12,alignItems:"end"}}>
          <Field label="Observaciones"><input style={iSt} value={f.obs} onChange={e=>set("obs",e.target.value)} placeholder="Detalle opcional…"/></Field>
          <div style={{display:"flex",alignItems:"center",gap:12,paddingBottom:1}}>
            {total>0&&<span style={{fontSize:13,color:C.muted}}>Total: <strong style={{color:C.success}}>{total}</strong></span>}
            {saved&&<span style={{color:C.success,fontSize:13,fontWeight:600}}>✓ Guardado</span>}
            <button onClick={submit} style={{background:canSave?C.accent:"#333",color:canSave?"#0f0e0d":"#666",border:"none",borderRadius:6,padding:"10px 24px",fontWeight:800,fontSize:14,cursor:canSave?"pointer":"not-allowed",fontFamily:"inherit",whiteSpace:"nowrap",transition:"all 0.15s"}}>Guardar</button>
          </div>
        </div>
      </div>
      {ultimos.length>0&&(
        <div>
          <div style={{fontSize:12,color:C.muted,marginBottom:10,letterSpacing:"0.06em",textTransform:"uppercase"}}>Últimos registros</div>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>{["Fecha","Negocio","Outlet","3os","Total","Obs."].map(h=><th key={h} style={thSt}>{h}</th>)}</tr></thead>
              <tbody>
                {ultimos.map(e=>(
                  <tr key={e.id}>
                    <td style={tdSt}>{fmtDate(e.fecha)}</td>
                    <td style={{...tdSt,color:C.success,fontWeight:600}}>{e.negocio||"—"}</td>
                    <td style={{...tdSt,color:C.accent,fontWeight:600}}>{e.outlet||"—"}</td>
                    <td style={{...tdSt,color:C.info,fontWeight:600}}>{e.terceros||"—"}</td>
                    <td style={{...tdSt,fontWeight:700}}>{e.negocio+e.outlet+e.terceros}</td>
                    <td style={{...tdSt,fontSize:12,color:C.muted}}>{e.obs||"—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ── KPIs ──────────────────────────────────────────────────────────────────────
function KPIs({registros,horas,envios}){
  const [periodo,setPeriodo]=useState("mes");
  const [fechaRef,setFechaRef]=useState("2026-03-20");
  const fechasDisp=[...new Set(registros.map(r=>r.fecha))].sort().reverse();
  const mesesDisp=[...new Set(fechasDisp.map(f=>f.slice(0,7)))].sort().reverse();
  const rango=useMemo(()=>{
    if(periodo==="dia") return {from:fechaRef,to:fechaRef,label:fmtDate(fechaRef)};
    if(periodo==="semana"){ const from=weekStart(fechaRef); const to=addDays(from,6); return {from,to,label:`Semana ${fmtDate(from)} – ${fmtDate(to)}`}; }
    const mes=monthOf(fechaRef); const from=mes+"-01";
    const d=new Date(from+"T12:00:00"); d.setMonth(d.getMonth()+1); d.setDate(0);
    return {from,to:d.toISOString().slice(0,10),label:fmtMonth(fechaRef)};
  },[periodo,fechaRef]);
  const regsRango=useMemo(()=>registros.filter(r=>dateInRange(r.fecha,rango.from,rango.to)),[registros,rango]);
  const enviosRango=useMemo(()=>envios.filter(e=>dateInRange(e.fecha,rango.from,rango.to)),[envios,rango]);
  const horasRango=useMemo(()=>horas.filter(h=>dateInRange(h.fecha,rango.from,rango.to)),[horas,rango]);
  const diasConActividad=useMemo(()=>[...new Set(regsRango.map(r=>r.fecha))].length,[regsRango]);
  const totalPrendas=useMemo(()=>+(regsRango.reduce((a,r)=>a+toPrendas(totalPaños(r.talles),r.articulo),0)).toFixed(1),[regsRango]);
  const prendasDia=useMemo(()=>+(regsRango.filter(r=>r.turno==="dia").reduce((a,r)=>a+toPrendas(totalPaños(r.talles),r.articulo),0)).toFixed(1),[regsRango]);
  const prendasNoche=useMemo(()=>+(regsRango.filter(r=>r.turno==="noche").reduce((a,r)=>a+toPrendas(totalPaños(r.talles),r.articulo),0)).toFixed(1),[regsRango]);
  const promPorJornada=diasConActividad>0?+(totalPrendas/diasConActividad).toFixed(1):0;
  const promMaqsOp=useMemo(()=>{
    const porDia={};
    regsRango.forEach(r=>{ if(!porDia[r.fecha])porDia[r.fecha]=new Set(); porDia[r.fecha].add(r.maqNum); });
    const dias=Object.values(porDia);
    return dias.length>0?+(dias.reduce((a,s)=>a+s.size,0)/dias.length).toFixed(1):0;
  },[regsRango]);
  const totalHoras=useMemo(()=>+(horasRango.reduce((a,h)=>a+h.horas,0)).toFixed(1),[horasRango]);
  const totalEnvios=useMemo(()=>enviosRango.reduce((a,e)=>a+e.negocio+e.outlet+e.terceros,0),[enviosRango]);
  const totalNegocio=useMemo(()=>enviosRango.reduce((a,e)=>a+e.negocio,0),[enviosRango]);
  const totalOutlet=useMemo(()=>enviosRango.reduce((a,e)=>a+e.outlet,0),[enviosRango]);
  const totalTerceros=useMemo(()=>enviosRango.reduce((a,e)=>a+e.terceros,0),[enviosRango]);
  const promEnviosPorJornada=diasConActividad>0?+(totalEnvios/diasConActividad).toFixed(1):0;
  const diasRestantes=useMemo(()=>{
    if(periodo!=="mes")return 0;
    const d=new Date(rango.to+"T12:00:00"); const hoy=new Date("2026-03-21T12:00:00");
    return Math.max(0,Math.round((d-hoy)/(1000*60*60*24)));
  },[rango,periodo]);
  const estimadoCierre=promPorJornada>0&&diasRestantes>0?+(totalPrendas+promPorJornada*diasRestantes).toFixed(0):null;

  const kpiCard=(label,value,color,sub=null,sub2=null)=>(
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:20}}>
      <div style={{fontSize:10,color:C.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}}>{label}</div>
      <div style={{fontSize:30,fontWeight:900,color,letterSpacing:"-0.02em",lineHeight:1}}>{value}</div>
      {sub&&<div style={{fontSize:12,color:C.muted,marginTop:6}}>{sub}</div>}
      {sub2&&<div style={{fontSize:11,color:C.muted,marginTop:2}}>{sub2}</div>}
    </div>
  );

  return (
    <div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:20,marginBottom:24}}>
        <div style={{display:"flex",gap:16,alignItems:"flex-end",flexWrap:"wrap"}}>
          <Field label="Período">
            <div style={{display:"flex",gap:4,background:C.surface,borderRadius:6,padding:3,border:`1px solid ${C.border}`}}>
              {[["dia","Diario"],["semana","Semanal"],["mes","Mensual"]].map(([k,l])=>(
                <button key={k} onClick={()=>setPeriodo(k)} style={{background:periodo===k?C.accent:"transparent",color:periodo===k?"#0f0e0d":C.muted,border:"none",borderRadius:4,padding:"7px 18px",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s",whiteSpace:"nowrap"}}>{l}</button>
              ))}
            </div>
          </Field>
          {periodo==="mes"?(
            <Field label="Mes">
              <select style={{...iSt,width:200}} value={monthOf(fechaRef)} onChange={e=>setFechaRef(e.target.value+"-01")}>
                {mesesDisp.map(m=><option key={m} value={m}>{fmtMonth(m+"-01")}</option>)}
              </select>
            </Field>
          ):(
            <Field label={periodo==="dia"?"Fecha":"Fecha de referencia"}>
              <select style={{...iSt,width:200}} value={fechaRef} onChange={e=>setFechaRef(e.target.value)}>
                {fechasDisp.map(f=><option key={f} value={f}>{fmtFechaConDia(f)}</option>)}
              </select>
            </Field>
          )}
          <div style={{fontSize:13,color:C.muted,paddingBottom:10}}>
            <strong style={{color:C.text}}>{rango.label}</strong>
            {diasConActividad>0&&<span style={{marginLeft:8}}>· {diasConActividad} jornada{diasConActividad!==1?"s":""}</span>}
          </div>
        </div>
      </div>

      <div style={{fontSize:12,color:C.muted,marginBottom:10,letterSpacing:"0.06em",textTransform:"uppercase",display:"flex",alignItems:"center",gap:8}}>
        <span style={{width:3,height:14,background:C.success,borderRadius:2,display:"inline-block"}}/>Prendas tejidas
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
        {kpiCard("Total prendas",totalPrendas,C.success,`Día: ${prendasDia} · Noche: ${prendasNoche}`)}
        {kpiCard("Promedio / jornada",promPorJornada,C.success,diasConActividad>0?`${diasConActividad} jornadas`:null)}
        {kpiCard("Turno Día",prendasDia,C.accent,totalPrendas>0?`${+(prendasDia/totalPrendas*100).toFixed(0)}% del total`:null)}
        {kpiCard("Turno Noche",prendasNoche,C.info,totalPrendas>0?`${+(prendasNoche/totalPrendas*100).toFixed(0)}% del total`:null)}
      </div>

      <div style={{fontSize:12,color:C.muted,marginBottom:10,letterSpacing:"0.06em",textTransform:"uppercase",display:"flex",alignItems:"center",gap:8}}>
        <span style={{width:3,height:14,background:C.accent,borderRadius:2,display:"inline-block"}}/>Máquinas y horas
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
        {kpiCard("Máqs operativas prom.",promMaqsOp,C.accent,`de ${MAQUINAS.length} total`)}
        {kpiCard("Total hs encendido",totalHoras>0?`${totalHoras}h`:"—",C.info,totalHoras>0&&diasConActividad>0?`${+(totalHoras/diasConActividad).toFixed(1)}h / jornada`:null)}
        {kpiCard("Prendas / hora",totalHoras>0?+(totalPrendas/totalHoras).toFixed(2):"—",C.success)}
      </div>

      {periodo==="mes"&&estimadoCierre&&(
        <>
          <div style={{fontSize:12,color:C.muted,marginBottom:10,letterSpacing:"0.06em",textTransform:"uppercase",display:"flex",alignItems:"center",gap:8}}>
            <span style={{width:3,height:14,background:C.warn,borderRadius:2,display:"inline-block"}}/>Proyección cierre de mes
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
            {kpiCard("Estimado fin de mes",estimadoCierre,C.warn,`${diasRestantes} días restantes`,`Ritmo: ${promPorJornada} pr/jornada`)}
            {kpiCard("Acumulado actual",totalPrendas,C.success,`${+(totalPrendas/estimadoCierre*100).toFixed(0)}% del estimado`)}
            {kpiCard("Faltan tejer",Math.max(0,estimadoCierre-totalPrendas),C.muted)}
          </div>
        </>
      )}

      <div style={{fontSize:12,color:C.muted,marginBottom:10,letterSpacing:"0.06em",textTransform:"uppercase",display:"flex",alignItems:"center",gap:8}}>
        <span style={{width:3,height:14,background:C.info,borderRadius:2,display:"inline-block"}}/>Envíos
      </div>
      {totalEnvios===0?(
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:24,color:C.muted,fontSize:13,textAlign:"center"}}>
          Sin envíos registrados en este período — cargalos en la pestaña "Envíos"
        </div>
      ):(
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:24}}>
          {kpiCard("Total envíos",totalEnvios,C.info,diasConActividad>0?`Prom: ${promEnviosPorJornada}/jornada`:null)}
          {kpiCard("Negocio",totalNegocio,C.success,totalEnvios>0?`${+(totalNegocio/totalEnvios*100).toFixed(0)}% del total`:null)}
          {kpiCard("Outlet",totalOutlet,C.accent,totalEnvios>0?`${+(totalOutlet/totalEnvios*100).toFixed(0)}% del total`:null)}
          {kpiCard("3os",totalTerceros,C.info,totalEnvios>0?`${+(totalTerceros/totalEnvios*100).toFixed(0)}% del total`:null)}
        </div>
      )}

      {mesesDisp.length>1&&periodo==="mes"&&(
        <>
          <div style={{fontSize:12,color:C.muted,marginBottom:10,letterSpacing:"0.06em",textTransform:"uppercase",display:"flex",alignItems:"center",gap:8}}>
            <span style={{width:3,height:14,background:C.muted,borderRadius:2,display:"inline-block"}}/>Comparativa mensual
          </div>
          <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden",marginBottom:24}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr>{["Mes","Prendas","Prom/jornada","Turno Día","Turno Noche","Máqs Op. prom.","Envíos total"].map(h=><th key={h} style={thSt}>{h}</th>)}</tr></thead>
              <tbody>
                {mesesDisp.map(mes=>{
                  const from=mes+"-01";
                  const d2=new Date(from+"T12:00:00"); d2.setMonth(d2.getMonth()+1); d2.setDate(0);
                  const to=d2.toISOString().slice(0,10);
                  const rr=registros.filter(r=>dateInRange(r.fecha,from,to));
                  const dias=[...new Set(rr.map(r=>r.fecha))].length;
                  const tp=+(rr.reduce((a,r)=>a+toPrendas(totalPaños(r.talles),r.articulo),0)).toFixed(1);
                  const td=+(rr.filter(r=>r.turno==="dia").reduce((a,r)=>a+toPrendas(totalPaños(r.talles),r.articulo),0)).toFixed(1);
                  const tn=+(rr.filter(r=>r.turno==="noche").reduce((a,r)=>a+toPrendas(totalPaños(r.talles),r.articulo),0)).toFixed(1);
                  const prom=dias>0?+(tp/dias).toFixed(1):0;
                  const porDia2={}; rr.forEach(r=>{ if(!porDia2[r.fecha])porDia2[r.fecha]=new Set(); porDia2[r.fecha].add(r.maqNum); });
                  const dArr=Object.values(porDia2); const maqProm=dArr.length>0?+(dArr.reduce((a,s)=>a+s.size,0)/dArr.length).toFixed(1):0;
                  const envM=envios.filter(e=>dateInRange(e.fecha,from,to));
                  const envT=envM.reduce((a,e)=>a+e.negocio+e.outlet+e.terceros,0);
                  const esActual=mes===monthOf(fechaRef);
                  return (
                    <tr key={mes} style={{background:esActual?C.accent+"11":"transparent"}}>
                      <td style={{...tdSt,fontWeight:esActual?800:400,color:esActual?C.accent:C.text}}>{fmtMonth(from)}</td>
                      <td style={{...tdSt,fontWeight:700,color:C.success}}>{tp}</td>
                      <td style={{...tdSt,color:C.muted}}>{prom}</td>
                      <td style={{...tdSt,color:C.accent}}>{td}</td>
                      <td style={{...tdSt,color:C.info}}>{tn}</td>
                      <td style={{...tdSt,color:C.muted}}>{maqProm}</td>
                      <td style={{...tdSt,color:envT>0?C.info:C.muted}}>{envT||"—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
      {/* ── INSIGHTS Y CAPACIDAD ── */}
      <InsightsCapacidad registros={registros}/>
    </div>
  );
}

// ── INSIGHTS Y CAPACIDAD ─────────────────────────────────────────────────────
const HS_TURNO=12;
const JH_MES=21;
const GRUPO_NOMBRES_MAP={"G7":"Galga 7","G10":"Galga 10","GSSR":"SSR","GP10":"Phanstar 10","G12":"Galga 12","GCV":"China Vieja"};
const GRUPOS_ORDER=["G7","G10","GSSR","GP10","G12","GCV"];

function InsightsCapacidad({registros}){
  const stats=useMemo(()=>{
    if(!registros.length) return null;

    // prendas/hora por máquina y grupo (1 registro = 1 turno de 12hs)
    // Excluir sábados del cálculo de capacidad (son jornadas extra)
    const regHabiles=registros.filter(r=>r.turno!=="sabado");
    const maqPH={}, grupoPH={};
    regHabiles.forEach(r=>{
      const ph=toPrendas(totalPaños(r.talles),r.articulo)/HS_TURNO;
      if(!maqPH[r.maqNum]) maqPH[r.maqNum]=[];
      maqPH[r.maqNum].push(ph);
      const g=MAQUINAS.find(m=>m.num===r.maqNum)?.grupo||"?";
      if(!grupoPH[g]) grupoPH[g]=[];
      grupoPH[g].push(ph);
    });

    const avg=arr=>arr.reduce((a,b)=>a+b,0)/arr.length;

    // grupo stats
    const grupoStats={};
    GRUPOS_ORDER.forEach(g=>{
      if(!grupoPH[g]) return;
      const n=new Set(registros.filter(r=>MAQUINAS.find(m=>m.num===r.maqNum)?.grupo===g).map(r=>r.maqNum)).size;
      const ph=avg(grupoPH[g]);
      grupoStats[g]={ph,n,capMes:+(ph*HS_TURNO*2*JH_MES*n).toFixed(0)};
    });

    const allPH=Object.values(maqPH).flatMap(v=>v);
    const promGlobal=avg(allPH);
    const techoPorDia=promGlobal*HS_TURNO*2*38;
    const techoMes=+(techoPorDia*JH_MES).toFixed(0);

    // eficiencia por mes
    const meses={};
    registros.forEach(r=>{
      const mes=r.fecha.slice(0,7);
      if(!meses[mes]) meses[mes]={prendas:0,dias:new Set(),diasHabiles:new Set(),maqsActivas:{},prendasSabado:0};
      meses[mes].prendas+=toPrendas(totalPaños(r.talles),r.articulo);
      meses[mes].dias.add(r.fecha);
      if(r.turno!=="sabado") meses[mes].diasHabiles.add(r.fecha);
      else meses[mes].prendasSabado+=toPrendas(totalPaños(r.talles),r.articulo);
      if(!meses[mes].maqsActivas[r.fecha]) meses[mes].maqsActivas[r.fecha]=new Set();
      meses[mes].maqsActivas[r.fecha].add(r.maqNum);
    });
    const mesStats=Object.entries(meses).sort().map(([mes,d])=>{
      const dias=d.dias.size;
      const diasH=d.diasHabiles.size;
      const techo=+(techoPorDia*diasH).toFixed(0);
      const prendasH=d.prendas-d.prendasSabado;
      const efic=+(prendasH/techo*100).toFixed(1);
      const promActivas=+(Object.values(d.maqsActivas).reduce((a,s)=>a+s.size,0)/Object.keys(d.maqsActivas).length).toFixed(1);
      return {mes,prendas:+d.prendas.toFixed(0),prendasSabado:+d.prendasSabado.toFixed(0),
        dias,diasH,techo,efic,promActivas,paradas:+(38-promActivas).toFixed(1)};
    });

    // top/bottom máquinas
    const maqAvgPH=Object.entries(maqPH).map(([m,v])=>({maq:Number(m),ph:avg(v)}));
    const top5=maqAvgPH.sort((a,b)=>b.ph-a.ph).slice(0,5);
    const bot5=[...maqAvgPH].sort((a,b)=>a.ph-b.ph).slice(0,5);

    // turno stats
    const turnoData={dia:{p:0,c:0},noche:{p:0,c:0},sabado:{p:0,c:0}};
    registros.forEach(r=>{ const p=toPrendas(totalPaños(r.talles),r.articulo); if(turnoData[r.turno]) { turnoData[r.turno].p+=p; turnoData[r.turno].c++; } });

    return {grupoStats,promGlobal,techoMes,techoPorDia,mesStats,top5,bot5,turnoData};
  },[registros]);

  if(!stats) return null;

  const {grupoStats,promGlobal,techoMes,techoPorDia,mesStats,top5,bot5,turnoData}=stats;
  const secTitle=(color,label)=>(
    <div style={{fontSize:12,color:C.muted,marginBottom:10,letterSpacing:"0.06em",textTransform:"uppercase",display:"flex",alignItems:"center",gap:8}}>
      <span style={{width:3,height:14,background:color,borderRadius:2,display:"inline-block"}}/>
      {label}
    </div>
  );

  return (
    <div style={{marginTop:32,borderTop:`2px solid ${C.border}`,paddingTop:28}}>
      <div style={{fontSize:16,fontWeight:900,color:C.accent,marginBottom:20,letterSpacing:"-0.01em"}}>
        Insights de Producción
      </div>

      {/* Techo mensual */}
      {secTitle(C.warn,"Capacidad teórica — 21 jornadas hábiles")}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:24}}>
        {[
          {label:"Techo mensual (21j)",value:techoMes.toLocaleString("es-AR"),color:C.warn,sub:"38 máqs × 2 turnos × 12hs"},
          {label:"Capacidad por día",value:+techoPorDia.toFixed(0),color:C.accent,sub:`${promGlobal.toFixed(2)} pr/hora promedio global`},
          {label:"Por turno (38 maqs)",value:+(promGlobal*HS_TURNO*38).toFixed(0),color:C.muted,sub:"turno de 12hs, todas activas"},
        ].map(k=>(
          <div key={k.label} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:18}}>
            <div style={{fontSize:10,color:C.muted,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}}>{k.label}</div>
            <div style={{fontSize:28,fontWeight:900,color:k.color,letterSpacing:"-0.02em"}}>{k.value}</div>
            <div style={{fontSize:11,color:C.muted,marginTop:4}}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Capacidad por grupo */}
      {secTitle(C.accent,"Capacidad por grupo (21j)")}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden",marginBottom:24}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["Grupo","Maqs","Prendas/hora","Cap/turno","Cap/jornada","Cap/mes (21j)"].map(h=><th key={h} style={thSt}>{h}</th>)}</tr></thead>
          <tbody>
            {GRUPOS_ORDER.filter(g=>grupoStats[g]).map(g=>{
              const s=grupoStats[g];
              const maxCap=Math.max(...Object.values(grupoStats).map(x=>x.capMes));
              const pct=s.capMes/maxCap;
              return (
                <tr key={g}>
                  <td style={{...tdSt,fontWeight:700,color:C.accent}}>{GRUPO_NOMBRES_MAP[g]}</td>
                  <td style={{...tdSt,textAlign:"center"}}>{s.n}</td>
                  <td style={{...tdSt,color:C.info,fontWeight:600}}>{s.ph.toFixed(2)}</td>
                  <td style={{...tdSt,color:C.muted}}>{+(s.ph*HS_TURNO).toFixed(1)}</td>
                  <td style={{...tdSt,color:C.muted}}>{+(s.ph*HS_TURNO*2).toFixed(1)}</td>
                  <td style={{...tdSt}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <strong style={{color:C.success,minWidth:50}}>{s.capMes.toLocaleString("es-AR")}</strong>
                      <div style={{flex:1,background:C.surface,borderRadius:2,height:5,overflow:"hidden",minWidth:60}}>
                        <div style={{height:"100%",width:`${pct*100}%`,background:C.success,borderRadius:2}}/>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
            <tr style={{background:C.surface}}>
              <td style={{...tdSt,fontWeight:900}}>TOTAL</td>
              <td style={{...tdSt,textAlign:"center",fontWeight:700}}>38</td>
              <td style={{...tdSt,color:C.info,fontWeight:700}}>{promGlobal.toFixed(2)}</td>
              <td style={{...tdSt,fontWeight:700}}>{+(promGlobal*HS_TURNO).toFixed(1)}</td>
              <td style={{...tdSt,fontWeight:700}}>{+(promGlobal*HS_TURNO*2).toFixed(1)}</td>
              <td style={{...tdSt,fontWeight:900,color:C.warn}}>{techoMes.toLocaleString("es-AR")}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Eficiencia mensual */}
      {secTitle(C.success,"Eficiencia real vs techo")}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden",marginBottom:24}}>
        <table style={{width:"100%",borderCollapse:"collapse"}}>
          <thead><tr>{["Mes","Jornadas háb.","Producción","Extra sáb.","Techo","Eficiencia","Maqs activas","Maqs paradas"].map(h=><th key={h} style={thSt}>{h}</th>)}</tr></thead>
          <tbody>
            {mesStats.map(m=>{
              const col=m.efic>=80?C.success:m.efic>=65?C.accent:C.danger;
              return (
                <tr key={m.mes}>
                  <td style={{...tdSt,fontWeight:700,color:C.accent}}>{fmtMonth(m.mes+"-01")}</td>
                  <td style={{...tdSt,textAlign:"center",color:C.muted}}>{m.diasH}</td>
                  <td style={{...tdSt,fontWeight:700,color:C.success}}>{m.prendas.toLocaleString("es-AR")}</td>
                  <td style={{...tdSt,color:m.prendasSabado>0?C.success:C.muted,fontSize:12}}>{m.prendasSabado>0?`+${m.prendasSabado}`:"—"}</td>
                  <td style={{...tdSt,color:C.muted}}>{m.techo.toLocaleString("es-AR")}</td>
                  <td style={{...tdSt}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <strong style={{color:col,minWidth:44}}>{m.efic}%</strong>
                      <div style={{flex:1,background:C.surface,borderRadius:3,height:8,overflow:"hidden",minWidth:80}}>
                        <div style={{height:"100%",width:`${m.efic}%`,background:col,borderRadius:3,transition:"width 0.3s"}}/>
                      </div>
                    </div>
                  </td>
                  <td style={{...tdSt,color:C.success,fontWeight:600,textAlign:"center"}}>{m.promActivas}</td>
                  <td style={{...tdSt,color:m.paradas>8?C.danger:C.warn,fontWeight:m.paradas>8?700:400,textAlign:"center"}}>
                    {m.paradas>0?`⚠ ${m.paradas}`:"—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Top/Bottom + Turno */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginBottom:8}}>
        {/* Top 5 */}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:16}}>
          <div style={{fontSize:11,color:C.muted,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:12}}>🏆 Top 5 — Prendas/hora</div>
          {top5.map((m,i)=>{
            const g=MAQUINAS.find(x=>x.num===m.maq)?.grupo||"?";
            return (
              <div key={m.maq} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:11,color:C.muted,width:16}}>{i+1}</span>
                  <span style={{fontWeight:700,color:C.accent}}>Maq {m.maq}</span>
                  <span style={{fontSize:11,color:C.muted}}>{GRUPO_NOMBRES_MAP[g]}</span>
                </div>
                <div style={{textAlign:"right"}}>
                  <span style={{fontWeight:700,color:C.success}}>{m.ph.toFixed(2)}</span>
                  <span style={{fontSize:10,color:C.muted,marginLeft:4}}>pr/h</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom 5 */}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:16}}>
          <div style={{fontSize:11,color:C.muted,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:12}}>⚠ Bottom 5 — Prendas/hora</div>
          {bot5.map((m,i)=>{
            const g=MAQUINAS.find(x=>x.num===m.maq)?.grupo||"?";
            return (
              <div key={m.maq} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontWeight:700,color:C.danger}}>Maq {m.maq}</span>
                  <span style={{fontSize:11,color:C.muted}}>{GRUPO_NOMBRES_MAP[g]}</span>
                </div>
                <div style={{textAlign:"right"}}>
                  <span style={{fontWeight:700,color:C.danger}}>{m.ph.toFixed(2)}</span>
                  <span style={{fontSize:10,color:C.muted,marginLeft:4}}>pr/h</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Turno día vs noche */}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:16}}>
          <div style={{fontSize:11,color:C.muted,fontWeight:700,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:12}}>Día vs Noche</div>
          {[["dia","Turno Día",C.accent],["noche","Turno Noche",C.info]].map(([t,label,color])=>{
            const d=turnoData[t];
            const totalDiaNoche=turnoData.dia.p+turnoData.noche.p;
            const pct=totalDiaNoche>0?d.p/totalDiaNoche*100:0;
            return (
              <div key={t} style={{marginBottom:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:12,fontWeight:700,color}}>{label}</span>
                  <span style={{fontSize:12,color:C.text,fontWeight:600}}>{+d.p.toFixed(0)} prendas</span>
                </div>
                <div style={{background:C.surface,borderRadius:3,height:8,overflow:"hidden",marginBottom:3}}>
                  <div style={{height:"100%",width:`${pct}%`,background:color,borderRadius:3}}/>
                </div>
                <div style={{fontSize:10,color:C.muted,display:"flex",justifyContent:"space-between"}}>
                  <span>{pct.toFixed(0)}% del total</span>
                  <span>{+(d.p/d.c).toFixed(1)} pr/registro</span>
                </div>
              </div>
            );
          })}
          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:10,marginTop:4,fontSize:11,color:C.muted}}>
            Brecha día/noche: <strong style={{color:C.text}}>{+(turnoData.dia.p/turnoData.noche.p).toFixed(2)}x</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
// Demo envíos
const DEMO_ENVIOS=[
  {id:uid(),fecha:"2026-03-18",negocio:320,outlet:28,terceros:95,obs:""},
  {id:uid(),fecha:"2026-03-19",negocio:285,outlet:32,terceros:110,obs:""},
  {id:uid(),fecha:"2026-03-20",negocio:310,outlet:25,terceros:88,obs:"Outlet cerrado tarde"},
  {id:uid(),fecha:"2026-03-17",negocio:298,outlet:30,terceros:102,obs:""},
  {id:uid(),fecha:"2026-03-14",negocio:340,outlet:22,terceros:118,obs:""},
  {id:uid(),fecha:"2026-03-13",negocio:275,outlet:35,terceros:95,obs:""},
  {id:uid(),fecha:"2026-02-28",negocio:290,outlet:29,terceros:88,obs:""},
  {id:uid(),fecha:"2026-02-27",negocio:315,outlet:31,terceros:105,obs:""},
];

// ── SUPABASE CLIENT ──────────────────────────────────────────────────────────
const SUPA_URL = "https://ucrwrwsnvcrzwaohksii.supabase.co";
const SUPA_KEY = "sb_publishable_QsXXbw75RSWAN6LJ2kDtKQ_po6yuzs2";

async function supaFetch(path, options={}) {
  const res = await fetch(`${SUPA_URL}/rest/v1/${path}`, {
    headers: {
      "apikey": SUPA_KEY,
      "Authorization": `Bearer ${SUPA_KEY}`,
      "Content-Type": "application/json",
      "Prefer": options.prefer || "return=representation",
      ...options.headers
    },
    ...options
  });
  if (!res.ok) { const e = await res.text(); throw new Error(e); }
  const text = await res.text();
  return text ? JSON.parse(text) : [];
}

// Convert DB row → app format
function dbToReg(r) {
  return { id:r.id, lote:r.lote||"—", maqNum:r.maq_num, fecha:r.fecha,
    tejedor:r.tejedor||"—", turno:r.turno, articulo:r.articulo||"estandar",
    obs:r.obs||"", pieza:r.pieza||"—", talle:r.talle||"—",
    cantidad:r.cantidad||0, talles:r.talles||emptyT() };
}
function regToDB(r) {
  return { id:r.id, lote:r.lote, maq_num:r.maqNum, fecha:r.fecha,
    tejedor:r.tejedor, turno:r.turno, articulo:r.articulo,
    obs:r.obs, pieza:r.pieza, talle:r.talle,
    cantidad:r.cantidad, talles:r.talles };
}
function dbToHora(h) {
  return { id:h.id, maqNum:h.maq_num, fecha:h.fecha, turno:h.turno, horas:h.horas };
}
function horaToDb(h) {
  return { id:h.id, maq_num:h.maqNum, fecha:h.fecha, turno:h.turno, horas:h.horas };
}

export default function App(){
  const [registros,setRegistros]=useState(DEMO_REG);
  const [horas,setHoras]=useState(DEMO_HORAS);
  const [envios,setEnvios]=useState(DEMO_ENVIOS);
  const [tab,setTab]=useState("kpis");
  const [dbStatus,setDbStatus]=useState("connecting"); // "connecting"|"ok"|"error"

  // Cargar datos de Supabase al iniciar
  useEffect(()=>{
    async function loadAll() {
      try {
        const [regsDB, horasDB, enviosDB] = await Promise.all([
          supaFetch("registros?select=*&order=fecha.desc&limit=5000"),
          supaFetch("horas?select=*"),
          supaFetch("envios?select=*&order=fecha.desc"),
        ]);
        if(regsDB.length>0) setRegistros([...DEMO_REG, ...regsDB.map(dbToReg)]);
        if(horasDB.length>0) setHoras(horasDB.map(dbToHora));
        if(enviosDB.length>0) setEnvios(enviosDB);
        setDbStatus("ok");
      } catch(e) {
        console.error("Supabase error:", e);
        setDbStatus("error");
      }
    }
    loadAll();
  }, []);

  const handleSaveHoras=(entradas,fecha,turno)=>{
    setHoras(prev=>{ const sin=prev.filter(h=>!(h.fecha===fecha&&h.turno===turno&&entradas.find(e=>e.maqNum===h.maqNum))); return [...sin,...entradas]; });
    // Save to Supabase
    supaFetch("horas", { method:"POST", body:JSON.stringify(entradas.map(horaToDb)), prefer:"resolution=merge-duplicates" }).catch(console.error);
  };

  const handleAddRegistro=(r)=>{
    setRegistros(p=>[r,...p]);
    supaFetch("registros", { method:"POST", body:JSON.stringify(regToDB(r)) }).catch(console.error);
  };

  const handleAddEnvio=(e)=>{
    setEnvios(p=>[e,...p]);
    supaFetch("envios", { method:"POST", body:JSON.stringify(e) }).catch(console.error);
  };
  const tabs=[["kpis","KPIs"],["resumen","Resumen"],["control","Control diario"],["cargar","Cargar producción"],["envios","Envíos"],["consultar","Consultar"],["planilla","Planilla"]];
  return (
    <div style={{fontFamily:"'DM Mono','Courier New',monospace",background:C.bg,minHeight:"100vh",color:C.text}}>
      <div style={{borderBottom:`1px solid ${C.border}`,padding:"16px 32px",display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:12}}>
        <div>
          <div style={{fontSize:10,color:C.muted,letterSpacing:"0.15em",textTransform:"uppercase",marginBottom:3,display:"flex",alignItems:"center",gap:8}}>
            Sistema de trazabilidad textil
            <span style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:9,
              color:dbStatus==="ok"?C.success:dbStatus==="error"?C.danger:C.muted}}>
              <span style={{width:6,height:6,borderRadius:"50%",background:dbStatus==="ok"?C.success:dbStatus==="error"?C.danger:C.muted,display:"inline-block"}}/>
              {dbStatus==="ok"?"Base conectada":dbStatus==="error"?"Sin conexión":"Conectando…"}
            </span>
          </div>
          <div style={{fontSize:21,fontWeight:900,color:C.accent,letterSpacing:"-0.01em"}}>Registro de Tejedores</div>
        </div>
        <div style={{display:"flex",gap:4,background:C.surface,borderRadius:8,padding:4,border:`1px solid ${C.border}`,flexWrap:"wrap"}}>
          {tabs.map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{background:tab===k?C.accent:"transparent",color:tab===k?"#0f0e0d":C.muted,border:"none",borderRadius:5,padding:"7px 14px",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:"inherit",letterSpacing:"0.03em",transition:"all 0.15s",whiteSpace:"nowrap"}}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{padding:"28px 32px"}}>
        {tab==="kpis"&&<KPIs registros={registros} horas={horas} envios={envios}/>}
        {tab==="resumen"&&<Resumen registros={registros} horas={horas}/>}
        {tab==="control"&&<ControlDiario registros={registros} horas={horas}/>}
        {tab==="cargar"&&(<div><div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:24,marginBottom:24}}><div style={{fontSize:12,color:C.muted,marginBottom:16,letterSpacing:"0.06em",textTransform:"uppercase"}}>Transcribir planilla física</div><CargarForm onAdd={handleAddRegistro} onAddHoras={handleSaveHoras}/></div></div>)}
        
        {tab==="consultar"&&<Consultar registros={registros}/>}
        {tab==="envios"&&<CargarEnvios envios={envios} onAdd={handleAddEnvio}/>}
        {tab==="planilla"&&<PlanillaView/>}
      </div>
    </div>
  );
}
