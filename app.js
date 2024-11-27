var map= new Map();
var graph=new Map();
var edge=new Map();
var visited=new Map();
var node=1;
 var nodes = new vis.DataSet([]);
 
 
 // create an array with edges
 var edges = new vis.DataSet([ ]);

 // create a network
 
 var container = document.getElementById('mynetwork');

 // provide the data in the vis format
 var data = {
     nodes: nodes,
     edges: edges
 };
 var options = {
     
     interaction:{
         zoomView:false,
         dragNodes:false
     },
     nodes:{
         shape:'circle',
         color:{
         border:"black",
        background:"yellow"}
     },

     edges:{
         arrows:{
             to:{
                 enabled:true
             }
         }
     }
 };

 
var network = new vis.Network(container, data, options);
//to create button event to create map
document.querySelector("#btn-c").addEventListener('click',function(e){
e.preventDefault();
    var from=document.querySelector("#from").value;
    var to = document.querySelector("#to").value;
    var node_from;
    var node_to;
    if(!map.has(from)&&from!==""){
        var id=node;
    map.set(from,id);
    node_from={
        id: map.get(from),
        label: from
    }
    nodes.add(node_from);
    var arr =[];
    graph.set(map.get(from),arr);
    visited.set(id,0);
    node+=1;
    }
    if(!map.has(to)&&to!==""){
        var id=node;
       map.set(to,id);
       node_to={
           id: map.get(to),
           label: to
       }
       nodes.add(node_to);
       var arr =[];
    graph.set(map.get(to),arr);
    visited.set(id,0);
    node+=1;
       }

    if(from!==""&&to!=="")
   { var a=map.get(from)+'-'+map.get(to);
       if(!edge.has(a)){
   var num=[1];
   edge.set(a,num);
   var id_ed=a+'-'+edge.get(a).length;
       edges.add({id:id_ed,
        from:map.get(from),to:map.get(to)});}
    else{edge.get(a).push(1);
        var id_ed=a+'-'+edge.get(a).length;
        edges.add({id:id_ed,
            from:map.get(from),to:map.get(to)});
}
graph.get(map.get(from)).push(map.get(to));
}

    network.redraw();
    
document.querySelector("#from").value="";
document.querySelector("#to").value="";
})
//function to refresh visited array
function refresh_visited()
{
    for(var j of visited.keys())
    {
        visited.set(j,0);
    }
}

//fuction for dfs
var timer = ms => new Promise(res => setTimeout(res, ms))
async function dfs( graph,initial)
{visited.set(initial,1);
 
 
// We need to wrap the loop into an async function for this to work

 var colors = initial;


nodes.updateOnly({id: colors ,color:{background:"red"}});
network.redraw();
await timer(400);

 // then the created Promise can be awaited
 
 
        for(var j of graph.get(initial) )
        {if(visited.get(j)!==1)
         {await timer(400); 
             dfs(graph,j);
             

        }
    }
}
//button to trigger dfs
document.querySelector("#btn-dfs").addEventListener('click',function(e){
    e.preventDefault();
    refresh_visited();
    var node_label=document.querySelector('#algoio').value;
dfs(graph,map.get(node_label));
document.querySelector('#algoio').value="";
visited.forEach(function(value)
{
    value=0;
})
})
//button to remove edge
document.querySelector('#btn-r').addEventListener('click',function(e){
    e.preventDefault();
    var from=document.querySelector("#from").value;
    var to = document.querySelector("#to").value;
    var a=map.get(from)+'-'+map.get(to);
    var id=a+'-'+edge.get(a).length;
    if(edge.get(a).length>1){
    edges.remove(id);
    edge.get(a).pop();}
    else{
        edges.remove(id);
        edge.delete(a);
    }
    network.redraw();
    var id_to=map.get(to);
    var id_from=map.get(from);

    for(var i=0;i<graph.get(id_from).length;i++)
    {
        if(graph.get(id_from)[i]===id_to)
        {
            graph.get(id_from).splice(i,1);
            break;
        }
    }
    for(var i=0;i<graph.get(id_to).length;i++)
    {
        if(graph.get(id_to)[i]===id_from)
        {
            graph.get(id_to).splice(i,1);
            break;
        }
    }
    document.querySelector("#from").value="";
document.querySelector("#to").value="";
})
//button to remove node
document.querySelector("#btn-r-n").addEventListener('click',function(e)
{e.preventDefault();
    var node_label=document.querySelector('#algoio').value;
    nodes.remove(map.get(node_label));
     
    network.redraw();
    for(var j of graph.keys())
    {
        for(var i=0;i<graph.get(j).length;i++)
        {
            if(graph.get(j)[i]===map.get(node_label))
            {
               graph.get(j).splice(i,1);
            }
        }
    } 
    graph.delete(map.get(node_label));
    visited.delete(map.get(node_label))
    map.delete(node_label); 

})
var path=[];
var path_map=[];
//path find algo
function path_find(graph,src,dst,path)
{visited.set(src,1);
    path.push(src);
    if(src===dst)
    {var arr=path.slice();
        path_map.push(arr);
        
    }
    else{
    for(var j of graph.get(src))
    {if(visited.get(j)!==1)
        {
            path_find(graph,j,dst,path)
        }

    }}

visited.set(src,0);
path.pop();


}


//button to fire path find algo
document.querySelector('#find_path').addEventListener('click',function(e)
{
    e.preventDefault();

    refresh_visited();
    var flag=0;
    var s=document.querySelector("#from").value;
    var d = document.querySelector("#to").value;
    var src=map.get(s);
    var dst=map.get(d);
    path_find(graph,src,dst,path);
if(path_map.length>=1){
    for(var j=0;j<path_map[0].length;j++)
    {
        nodes.updateOnly({id:path_map[0][j],color:{background:"green"}});
        if(j<path_map[0].length-1)
        {
            var a=path_map[0][j]+'-'+path_map[0][j+1];
            var id=a+'-'+edge.get(a).length;
            edges.updateOnly({id:id,color:"red"})
        }
    }
    network.redraw();
    path_map=[];}
    else{
        alert("no path exists!");
    }
    document.querySelector("#from").value="";
    document.querySelector("#to").value="";
   
})

//button to reset
document.querySelector('#reset').addEventListener('click',function(e){
    e.preventDefault();
for(var j of edge.keys())
{var id=j+'-'+edge.get(j).length;
edges.updateOnly({id:id,color:"black"});

}
for(var k of map.values())
{
    nodes.updateOnly({id:k,color:{background:"yellow"}});
}
network.redraw();    
 
})