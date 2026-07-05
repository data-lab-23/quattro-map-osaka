"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Shop } from "@/types/shop";

type MapsApi = { Map:new(el:HTMLElement, options:object)=>MapInstance; InfoWindow:new()=>InfoInstance; marker:{ AdvancedMarkerElement:new(options:object)=>MarkerInstance } };
type MapInstance = object; type InfoInstance = { setContent:(value:string)=>void; open:(options:object)=>void };
type MarkerInstance = { addListener:(event:string, callback:()=>void)=>void };
declare global { interface Window { google?: { maps: MapsApi & { importLibrary:(name:string)=>Promise<unknown> } } } }

export function MapView({ shops }: { shops: Shop[] }) {
  const ref = useRef<HTMLDivElement>(null); const [error,setError]=useState(false);
  const key=process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  useEffect(()=>{ if(!key || !ref.current) return; let active=true;
    const render=async()=>{ try { await window.google?.maps.importLibrary("marker"); if(!active||!ref.current||!window.google)return;
      const map=new window.google.maps.Map(ref.current,{center:{lat:34.6863,lng:135.5001},zoom:12,mapId:"DEMO_MAP_ID",mapTypeControl:false,streetViewControl:false});
      const info=new window.google.maps.InfoWindow(); const basePath=process.env.NEXT_PUBLIC_BASE_PATH??""; shops.filter(shop=>shop.latitude!==undefined&&shop.longitude!==undefined).forEach(shop=>{ const marker=new window.google!.maps.marker.AdvancedMarkerElement({map,position:{lat:shop.latitude!,lng:shop.longitude!},title:shop.name}); marker.addListener("click",()=>{info.setContent(`<div class="map-pop"><b>${shop.name}</b><br><a href="${basePath}/shops/${shop.slug}">詳細を見る</a></div>`);info.open({map,anchor:marker});}); });
    } catch { setError(true); } };
    if(window.google) void render(); else { const script=document.createElement("script"); script.src=`https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&libraries=marker&callback=Function.prototype`; script.async=true; script.onload=()=>void render(); script.onerror=()=>setError(true); document.head.appendChild(script); }
    return()=>{active=false};
  },[key,shops]);
  if(!key||error) return <div className="google-embed"><iframe title="大阪市のクアトロフォルマッジ検索地図" src="https://www.google.com/maps?q=%E3%82%AF%E3%82%A2%E3%83%88%E3%83%AD%E3%83%95%E3%82%A9%E3%83%AB%E3%83%9E%E3%83%83%E3%82%B8+%E5%A4%A7%E9%98%AA%E5%B8%82&output=embed" loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen/><div><strong>Google Mapsで大阪市の候補店を表示中</strong><span>掲載情報は店舗ページと公式情報をあわせてご確認ください。</span><Link href="/submit">お店の情報を送る →</Link></div></div>;
  return <div ref={ref} className="map" role="region" aria-label="店舗マップ"/>;
}
