import * as XLSX from 'ts-xlsx';
import fs from 'fs';
import path from 'path';


interface productUrl {
    path: string,
    type: string
}
interface productDetail {
    features: string,
    size: string
}
interface product {
    id: string,
    chineseName: string,
    name: string,
    url: productUrl[],
    detail: productDetail,
    price: number,
    upDate: string
}

const sourceUrl:string = process.argv[2];
let buf = fs.readFileSync(sourceUrl);

let baseUrl = 'https://andreamartinofficial.com'



let wb: XLSX.IWorkBook = XLSX.read(buf, { type: 'buffer' })

let sheetJson = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

let womenList:product[] = [];
let menList:product[] = [];

function pushImageUrl(item: any) {
    let url:productUrl[] = [];
    url.push({
        path: `${baseUrl}/${item['正面图片']}`,
        type: 'z'
    })
    url.push({
        path: `${baseUrl}/${item['反面图片']}`,
        type: 'f'
    })
    url.push({
        path: `${baseUrl}/${item['特写图片']}`,
        type: 't'
    })
    url.push({
        path: `${baseUrl}/${item['其他图片']}`,
        type: 'n'
    })
    return url;
}

function pushProduct(flag: string, item: any) {
    return {
        id: `${flag}-${item['产品类别']}-${item['产品ID']}`,
        chineseName: item['中文名称'],
        name: item['英文标题'],
        url: pushImageUrl(item),
        detail: {
            features: item['描述'],
            size: item['尺寸信息']
        },
        price: item['价格'],
        upDate: item['上架日期']
    }
}

sheetJson.forEach((item:any, index:number)=> {
    let flag:string = ''
    if (item['产品男女'] === 'MEN') {
        flag = 'm'
        menList.push(pushProduct(flag, item))
    } else {
        flag = 'w'
        womenList.push(pushProduct(flag, item))
    }
})

const context = JSON.stringify( [
    womenList,
    menList
]);


let file = path.join(__dirname, 'outFiles/test.json');

fs.writeFile(file, context, function(err) {
    if (err) {
        return console.log(err);
    }
    console.log('文件创建成功，地址：' + file);
});

