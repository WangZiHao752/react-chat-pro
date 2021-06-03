const express = require('express');
const fs = require('fs');
const router = express.Router();
const multiparty = require('multiparty');


router.post('/api/login', (req, res) => {
    // don't forget to delete all req.files when done 
    //生成multiparty对象，并配置上传目标路径
    let form = new multiparty.Form({
        uploadDir: './images/'
    });
    //上传完成后处理
    form.parse(req, function (err, fields, files) {
        const {username,room}  = fields
        //fields为接受的表单数据
        /* { picnicId: [ '3210' ], pName: [ '321' ] } */
        /*files为文件数据
        {
          pPicnic: [
            {
              fieldName: 'pPicnic',
              originalFilename: '0_qq_47518788_1588348728.jpg',
              path: 'images\\eLOP1EytAkwGpx1sBF2qnIlV.jpg',    
              headers: [Object],
              size: 9706
            }
          ]
        }*/
        // console.log(fields);
        let filesTmp = JSON.stringify(files, null, 2);
        if (err) {
            console.log('parse error: ' + err);
        } else {
            //console.log('parse files: ' + filesTmp);
            filesTmp = JSON.parse(filesTmp)
            let inputFile = filesTmp.avatar1[0];
            let uploadedPath = inputFile.path;
            let responSrc = Math.random().toString(16).slice(2, 12) + inputFile.originalFilename
            let dstPath = './images/' + responSrc;
            //重命名为真实文件名
            fs.rename(uploadedPath, dstPath, function (err) {
                if (err) {
                    console.log('rename error: ' + err);
                    res.send({
                        code: 200,
                        status:"error",
                        msg: "图片上传失败,登陆失败",
                        
                    })
                } else {
                    let userList = JSON.parse(fs.readFileSync('./serve/data/userInfo.json','utf8'));
                    const Token =  Math.random().toString(16).slice(2,16)
                    userList.push({
                        username:username[0],
                        room:room[0],
                        src:'/static/'+responSrc,
                        Token
                    })
                    fs.writeFileSync('./serve/data/userInfo.json',JSON.stringify(userList),'utf8')
                    console.log(userList);
                    res.send({
                        code: 200,
                        msg: "登陆成功",
                        status:"success",
                        src:'/static/'+responSrc,
                        Token
                    })
                }
            });
        }
    });
    // res.send({
    //     code:200,
    //     msg:`/static/media/${Random}.png`,
    //     Token:Math.random().toString(16).slice(2,16)
    // })

})

module.exports = router;