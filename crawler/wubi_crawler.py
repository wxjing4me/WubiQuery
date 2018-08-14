#-*-coding:utf-8-*-

import requests
from bs4 import BeautifulSoup
import os

#---------------------------
# 从52wubi上爬取数据
#---------------------------
def wubi_crawler_52wubi():

    base_url = 'http://www.52wubi.com'
    gifs_dir = '../gifs/'

    wf = open('hanzi_wubi.txt', 'w')

    for i in range(1, 7832):

        print '>> ', i, '--------------------------'

        inc = '/wbbmcx/wubi_' + str(i) + '.html'
        url = base_url + inc 
        response = requests.get(url)
        response.encoding = 'gbk'
        html_doc = response.text

        soup = BeautifulSoup(
            html_doc, 
            'html.parser'
        )

        wubileft = soup.find('div', class_='wubileft')
        table = wubileft.find('table')
        trs = table.find_all('tr')

        hanzi = trs[1].find('td').get_text().strip()
        pinyin = trs[2].find('td').get_text().strip()
        wubi_code = trs[3].find('td').get_text().strip()
        wubi_img_src = base_url + trs[4].find('img').get('src').strip()

        print hanzi
        print wubi_code
        print wubi_img_src

        
        if len(hanzi) < 1:
            continue

        ## save hanzi and wubi
        wf.write('"' + hanzi + '":"' + wubi_code + '"\n')
        
        ## get image
        wubi_img = requests.get(wubi_img_src).content

        if wubi_img[:6] == '<html>':
            pass
        else:
            file = gifs_dir + hanzi + '.gif'
            with open(file, 'wb') as f:
                f.write(wubi_img)

        
#---------------------------
# 从cidianwang上爬取图片
# 若52wubi已有图片，则pass，否则保存至gifs
#---------------------------
def wubi_crawler_cidianwang():
    base_url = 'http://www.cidianwang.com/file/wubi/'
    gifs_dir = '../gifs/'

    hanziFilePath = 'hanzi_wubi.txt'

    def isExistImg(hanzi):
        img_file = gifs_dir + hanzi + '.gif'
        return os.path.exists(img_file.decode('utf-8'))

    def readHanziFile(file_path):
        hanziList = []
        with open(file_path, 'r') as f:
            for line in f.readlines():
                hanzi = line.strip().split('"')[1]
                if not isExistImg(hanzi):
                    hanziList.append(hanzi)
        return hanziList

    hanziList = readHanziFile(hanziFilePath)
    for hanzi in hanziList:
        ## get image
        wubi_img_src = base_url + hanzi + '.gif'
        # print hanzi
        wubi_img = requests.get(wubi_img_src).content
        
        try:
            if wubi_img[-1] == '>':
                print wubi_img_src, 'pass'
                pass
            else:
                print wubi_img_src, 'oik'
                file = gifs_dir + hanzi + '.gif'
                with open(file.decode('utf-8'), 'wb') as f:
                    f.write(wubi_img)
        except:
            continue


#---------------------------
# 爬取图片，记录图片url地址
#---------------------------
def wubi_image_crawler():

    url_52wubi = 'http://www.52wubi.com/wbbmcx/tp/'
    url_cidianwang = 'http://www.cidianwang.com/file/wubi/'
    
    hanziFilePath = 'hanzi_wubi.txt'

    def readHanziFile(file_path):
        hanziList = []
        with open(file_path, 'r') as f:
            for line in f.readlines():
                hanzi = line.strip().split('"')[1]
                hanziList.append(hanzi)
        return hanziList

    hanziList = readHanziFile(hanziFilePath)

    wf = open('hanzi_imgurl.txt', 'w')

    for i in range(2132, len(hanziList)):

        hanzi = hanziList[i]

        print i, '/',  len(hanziList)

        ## get image from 52wubi
        wubi_img_src = url_52wubi + hanzi + '.gif'
        wubi_img = requests.get(wubi_img_src).content

        if wubi_img[:6] != '<html>':
            wf.write(hanzi + '::' + wubi_img_src + '\n')
        else:
            ## get image from cidianwang
            wubi_img_src = url_cidianwang + hanzi + '.gif'
            wubi_img = requests.get(wubi_img_src).content

            if wubi_img[-1] != '>':
                wf.write(hanzi + '::' + wubi_img_src + '\n')
            else:
                wf.write(hanzi + '::' + '\n')  

    wf.close()


#---------------------------
# 整理成js的字典格式
#---------------------------
def build_json():
    hanzi_wubi_file = 'hanzi_wubi2.txt'
    hanzi_imgurl_file = 'hanzi_imgurl.txt'
    json_file = 'hanzi_wubi2.js'

    hanziDict = {}
    hanziList = []
    
    with open(hanzi_wubi_file, 'r') as f:
        for line in f.readlines():
            string = line.strip().split('-')
            hanzi = string[0]
            wubi = string[1]
            hanzis = {}
            if len(wubi) != 0:
                hanzis["wubi_code"] = wubi
            hanziDict[hanzi] = hanzis
            hanziList.append(hanzi)

    print len(hanziDict)

    with open(hanzi_imgurl_file, 'r') as f:
        for line in f.readlines():
            string = line.strip().split('-')
            hanzi = string[0]
            img_url = string[1]
            hanzis = {}
            if len(img_url) != 0:
                hanziDict[hanzi]["wubi_img_url"] = img_url

    with open(json_file, 'w') as f:
        f.write('var Hanzi_Wubi = {' + '\n')
        for hanzi in hanziList:
            value = hanziDict[hanzi]
            content = '\t"' + hanzi + '"' + ": {\n"
            if value.has_key("wubi_code"):
                content += '\t\t"wubi_code": "' + value["wubi_code"] + '",\n'
            if value.has_key("wubi_img_url"):
                content += '\t\t"wubi_img_url": "' + value["wubi_img_url"] + '",\n'

            content += '\t\t},\n'
            f.write(content)

        f.write('}')


if __name__ == '__main__':
    build_json()




