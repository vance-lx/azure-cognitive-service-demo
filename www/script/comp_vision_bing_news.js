function init_vision_bing_news_search() {
    return {
        template: `
        <div style="width:100%">
            <v-container grid-list-xl>
                <v-layout wrap style="width:100%;text-align:right">
            
              <v-flex xs12 sm6 row justify-end>

              <v-text-field type="text" label="Key Words" clearable id="txt-search" value="贸易战" 
              ></v-text-field>
              <v-btn color="blue" @click="bingSearchNews()" >
              <v-icon dark>search</v-icon>
              </v-btn>
      
              </v-flex>  
                       
                <v-flex xs12 sm12 md12 style="margin: 0 auto;">
                    <v-card>
                            <v-progress-linear :indeterminate="true" v-if="progressing"></v-progress-linear>
                            <v-data-table
                                :headers="sort"
                                :items="value"
                                hide-actions
                                class="elevation-1"
                            >
                                <template slot="items" slot-scope="props">
                                <td style="text-align:left">{{ props.item.name }}</td>
                                <td class="text-xs-right">{{ props.item.description }}</td>
                                </template>
                            </v-data-table>
                            
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>
        </div>

        `,
        data() {
            return {
                _type: String,
                readLink: String,
                queryContext: Object,
                totalEstimatedMatches: String,
                sort: [],
                value: [],
                headers: [{
                    text: 'Name',
                    align: 'left',
                    sortable: false,
                    value: 'name'
                },
                {
                    text: 'Value',
                    align: 'right',
                    sortable: false,
                    value: 'value'
                }],
                progressing: false
            }
        },
        mounted: function () {

        },
        methods: {
            bingSearchNews() {
                console.log("bing search starting");
                var that = this;
                var txtSearch = document.getElementById('txt-search');
                alert(txtSearch.value);

                that.progressing = true
                axios({
                    method: 'GET',
                    url: `/api/bingSearchNews?keyword=${txtSearch.value}`,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: null
                }).then(function (response) {
                    const data = response.data;
                    console.log(JSON.stringify(data, null, 2));
                    
                    //alert(data._type);
                    that._type=data._type;
                    that.readLink=data.readLink;
                    that.queryContext=data.queryContext;
                    that.sort =data.sort;
                    that.value =data.value;
                    // that.faceRectangles = [];
                    // that.gender = [];
                    // that.age = [];
                    // that.values = [];
                    // for (var item of data) {
                    //     that.faceRectangles.push(item.faceRectangle)
                    //     that.age.push(item.faceAttributes.age)
                    //     that.gender.push(item.faceAttributes.gender)
                    //     that.values = obj2array(flatten(item), 'name', 'value')

                    // }
                    that.progressing = false
                }).catch(function (e) {
                    console.log(e)
                    that.progressing = false
                });
            }
        }

    }
}