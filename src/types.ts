import { HttpContext, HttpHeaders, HttpParams } from "@angular/common/http";

export interface Options {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    context?: HttpContext;
    observe?: 'body';
    params?: HttpParams | {
        [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
    transferCache?: {
        includeHeaders?: string[];
    } | boolean;
}


export interface Company{
    company: CompanyDesc;
    history: HistoryDesc;
    peers: string[]
    news: NewsDesc[];
    sentiment: Sentiment;
    hourlyPrice: hourlyPrice;
    recommendation: recommendDesc[];
    epsearning: espEarningDesc[];
    charting: hourlyPrice;

}
export interface QueryParams{
    [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    name: string;
}

export interface CompanyDesc{
    country: string;
    currency: string;
    estimateCurrency: string;
    exchange: string;
    finnhubIndustry: string;
    ipo: string;
    logo: string;
    marketCapitalization: number;
    name: string;
    phone: string;
    shareOutstanding: number;
    ticker: string;
    weburl: string;
}

export interface HistoryDesc{
    c:number;
    d:number;
    dp:number;
    h:number;
    l:number;
    o:number;
    pc:number;
    t:number;
}

export interface NewsDesc {
    category:String;
    datetime:number;
    headline:String;
    id: number;
    image: String;
    related:String;
    source:String;
    summary:String;
    url:String;
}
export interface Sentiment {
    data: SentimentDesc[]
    symbol: String
}
export interface SentimentDesc {
    symbol: String;
    year: number;
    month: number;
    change: number;
    mspr: number;
}

export interface hourlyPrice{
    ticker: String;
    queryCount: number;
    resultCount:number;
    adjusted: Boolean;
    results: hourPrice[];
}

export interface hourPrice{
    v: number;
    vw: number;
    o: number;
    c: number;
    h: number;
    l: number;
    t: number;
    n: number;
}

export interface recommendDesc{
    buy:number;
    hold: number;
    period: String;
    sell: number;
    strongBuy: number;
    strongSell: number;
    symbol: String;
}

export interface espEarningDesc {
        actual: number;
        estimate: number;
        period: string;
        quarter: number;
        surprise:number;
        surprisePercent: number;
        symbol: String;
        year: number;
}

export interface AutoData {
    autocomplete: AutoComplete[]
}

export interface AutoComplete {
    description: string,
    displaySymbol: string,
    symbol:string,
    type: string
}

export interface StockQuote {
    stock: HistoryDesc;
}

export interface WatchList {
    ticker: string;
    name: string;
    price: number;
    change: number;
    percent: number
}

export interface Portfolio {
    _id: string;
    name: string;
    price: number;
    market_val: number;
    change: number;
    avg_cost: number;
    total_cost: number;
    quantity: number;
}

export interface Money {
    _id: string,
    balance: number
}

export interface hourlyData {
    hourlyPrice :  hourlyPrice
}