(() => {
  'use strict';
  // One existing replay fixture shared by the operational map and story views.
  // Values come from the current Live Nowcast route and initiation score series.
  const points = [
    ['−60m','13:00',-44,35,'MODERATE','Organizing',36,.26,false],
    ['−45m','13:15',-33,26,'MODERATE','Organizing',38,.29,false],
    ['−30m','13:30',-22,17,'STRONG','Intensifying',42,.35,false],
    ['−15m','13:45',-11,9,'STRONG','Intensifying',45,.48,false],
    ['NOW','14:00',0,0,'STRONG','Intensifying',48,.64,true],
    ['+15m','14:15',31,19,'STRONG','Intensifying',49,.68,true],
    ['+30m','14:30',68,38,'SEVERE','Peak likely*',52,.72,true],
    ['+45m','14:45',105,64,'SEVERE','Peak likely*',53,.69,true],
    ['+60m','15:00',145,90,'SEVERE','Peak likely*',54,.62,true],
    ['+90m','15:30',205,123,'STRONG','Weakening*',47,.48,false],
    ['+120m','16:00',264,154,'MODERATE','Weakening*',39,.31,false]
  ];
  window.VAYU_REPLAY = Object.freeze(points.map(([label,clock,x,y,intensity,trend,dbz,initScore,initiationVisible],index) => Object.freeze({
    index,label,clock,x,y,intensity,trend,dbz,initScore,initiationVisible,
    stage:trend.replace('*',''),
    lat:Number((23+Math.max(10,61-(index-4)*6)/100).toFixed(2)),
    lon:Number((85+Math.min(99,Math.max(10,28+(index-4)*6))/100).toFixed(2)),
    age:Math.max(0,32+(index-4)*15)
  })));
})();
