const store = new Vuex.Store({
    state:{
      loading:true,
      componentNames:[
            {name:"Vision", title: "Vision", icon:"edit",items:[
                {name:"vision-face",title:"Face API",icon:"pages"}, 
            ]},

        ],
    },
    mutations: {
        setLoading:function(state, loading) {
            state.loading = loading    
        },
    }
});