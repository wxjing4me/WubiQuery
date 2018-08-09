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


if __name__ == '__main__':
    wubi_crawler_cidianwang()




