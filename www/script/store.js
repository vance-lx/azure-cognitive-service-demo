const store = new Vuex.Store({
    state:{
      loading:true,
      selectedView:null,
      componentNames:[
            {name:"Vision", title: "Vision", icon:"edit",items:[
                {name:"vision-face-detect",title:"Face Detect",icon:"pages"}, 
                {name:"vision-face-identify",title:"Face Identify",icon:"pages"}, 
            ]},

        ],
    },
    mutations: {
        setLoading:function(state, loading) {
            state.loading = loading    
        },
        setSelectedView:function(state, selectedView) {
            state.selectedView = selectedView  
            router.push({name:selectedView})  
        },
    }
});