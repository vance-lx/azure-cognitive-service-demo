function init_vision_bing_news_search() {
    return {
        template: `
        <div style="width:100%" >
            <v-container grid-list-xl>
                <v-layout wrap column>            
                    <v-flex xs12 sm6>
                        <v-text-field type="text" label="Key Words" clearable id="txt-search" value="china"
                            append-outer-icon="search"
                            @click:append-outer="bingSearchNews()">
                        </v-text-field>
                    </v-flex>  
                       
                    <v-flex xs12 sm6 wrap>
                        <v-progress-linear :indeterminate="true" v-if="progressing"></v-progress-linear>

                    <v-flex xs12 sm12 md12>
                        <v-card id="zingChart"></v-card>
                        <v-layout wrap>
                            <v-flex v-for="card in cards"
                                :key="card.name">
                                <v-card style="margin: 10px auto;text-align:left" width="350px">
                                    <v-card-media
                                        :src=card.image
                                        height="200px">
                                    </v-card-media>

                                    <v-card-title primary-title  height="200px">
                                        <div style="text-align:left;">
                                            <div class="headline white--text" v-text="card.name"></div>
                                            <span class="grey--text" v-text="card.description"></span>
                                        </div>
                                    </v-card-title>
                                </v-card>
                            </v-flex>
                        </v-layout>                                                  
                    </v-flex>
                    </v-flex>  
                </v-layout>
            </v-container>
        </div>
`
        ,
        data() {
            return {
                _type: String,
                show: false,
                readLink: String,
                queryContext: Object,
                totalEstimatedMatches: String,
                sort: [],
                cards: [],
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
                var that = this;
                var txtSearch = document.getElementById('txt-search');
                //alert(txtSearch.value);

                that.progressing = true
                var documentsPostArr = [];
                axios({
                    method: 'GET',
                    url: `/api/bingSearchNews?keyword=${txtSearch.value}`,
                    headers: {
                        "Content-Type": "application/json"
                    },
                    data: null
                }).then(function (response) {
                    const data = response.data;

                    //alert(data._type);
                    that._type = data._type;
                    that.readLink = data.readLink;
                    that.queryContext = data.queryContext;
                    that.sort = data.sort;
                    that.cards = [];
                    var i = 0;
                    for (var item of data.value) {
                        i++;
                        documentsPostArr.push(new DocumentPost("en", i, item.description))
                        that.cards.push(new NewsCard(item.name, item.description, item.image, item.url, item.datePublished, item.provider));
                    }

                    AnalyzingDocuments(documentsPostArr);
                    that.progressing = false
                }).catch(function (e) {
                    console.log(e)
                    that.progressing = false
                });
            }
        }

    }
}

function DocumentPost(language, id, text) {
    this.language = language;
    this.id = id;
    this.text = text;
}

function NewsCard(name, description, image, url, datePublished, provider) {
    this.name = name;
    this.description = description;
    if (image == null || image.thumbnail == null)
        this.image = "https://www.bing.com/th?id=null";//"https://cdn.vuetifyjs.com/images/cards/sunshine.jpg"
    else {
        var urlStr = image.thumbnail.contentUrl;
        var m = urlStr.indexOf("&");
        this.image = urlStr.substring(0, m);
    }
    this.url = url;
    this.datePublished = datePublished;
    if (provider == null && provider[0].name == null)
        this.provider = provider[0].name;
}

function AnalyzingDocuments(documents) {
    var desArr = String;
    axios({
        method: 'POST',
        url: '/api/textAnalyticsInKeyPhrases',
        headers: {
            "Content-Type": "application/json"
        },
        data: documents
    }).then(function (response) {
        const data = response.data;
        var keyPhrasesArr = [];
        keyPhrasesArr = data.documents;

        for (var document of data.documents) {
            for (var item of document.keyPhrases) {

                desArr = desArr + item + ",";
            }
        }

        var zcConfig = {
            type: 'wordcloud',
            options: {
                text: desArr,
                minLength: 4,
                ignore: ['establish', 'this'],
                maxFontSize: 50,
                minFontSize: 10,
                // colorType: 'color',
                // color: 'white',

                style: {
                    // backgroundColor: 'black',
                    borderRadius: 2,
                    fontFamily: 'Scope One',
                    padding: '5px 10px',
                    hoverState: {
                        alpha: 1,
                        backgroundColor: 'white',
                        fontColor: 'black',
                        borderColor: 0,
                        textAlpha: 1,
                    },
                    tooltip: {
                        text: '%text: %hits',
                        visible: true,

                        alpha: 1,
                        //backgroundColor: 'purple',
                        borderColor: 'none',
                        borderRadius: 2,
                        fontColor: 'blank',
                        fontFamily: 'Georgia',
                        fontSize: 12,
                        textAlpha: 0.9,
                    }
                }
            }
        };

        zingchart.render({
            id: 'zingChart',
            data: zcConfig,
            height: 400,
            width: '100%'
        });
    }).catch(function (e) {
        console.log(e)
    });

}

