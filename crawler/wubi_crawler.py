import requests
from bs4 import BeautifulSoup

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

    


