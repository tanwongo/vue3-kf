
export const Api = {
    BASE_URL: "https://cs4.17996api.net",
    // 172.26.205.166: 8001
    // https://cs4.17996api.net
    HOME_FAQ_LIST:"/faq/list/", //FAQ
    T_CUSTOMER_SERVICE:"/appinfo?appid=",//第三方客服
    MY_QUESTION:"/posts/list", //我的问题
    DETAIL_QUESTION:"/posts/detail", //问题详情
    CREATE_QUESTION:"/posts/create", //创建问题
    REPLY_QUESTION:"/posts/reply", //回复问题
    CLOSE_QUESTION:"/posts/close", //关闭问题
    IMAGES_CDN:"https://cs.17996cdn.com", //图片地址
    AUTH:{
        k:"Authorization",
        v: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIwMDAwMTU1LCJ0aW1lIjoxNTk3ODIwODY1LCJkZXZpY2VpZCI6IjQyNkRDQjIwLUM5QjEtNDZBQS05MjVBLTEyNDU3NDgwNDE4NSIsImd1aWQiOiI0MjZEQ0IyMC1DOUIxLTQ2QUEtOTI1QS0xMjQ1NzQ4MDQxODUiLCJhcHBpZCI6IjEwMDAwMDAwIiwiZXhwaXJlIjoxNTk4NDI1NjY1fQ.ZIZj2tn_BWlynfkn1Px8r5r70oXqxZsgUIOvquUEbFA"
    }
}

export default Api