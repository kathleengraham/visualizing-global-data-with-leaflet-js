#Mapping Global Trends

For this project, we focused on plotting some popular global trends such as wine consumption, Olympic medals won, and international military bases by country. We wanted to plot all 3 trends on one map that contained 3 different views: light, dark, and satallite. 

STEP 1:

   FIND THE DATA! This is never as easy as it sounds. We were able to find a PDF containing wine consumption data, but we had to web scrape a few different sites to get the Olympic medal and international military bases data.

STEP 2:

    Wine Consumption Data: We were able to find a PDF containing wine consumption data, however, we needed to find a way to convert that data from a PDF into a CSV so we can use it in our code. We used https://pdf.wondershare.com/ to do just that. 
    
    Olympic Medal Data: We originally wanted to plot all the Billionaires around the world but ran into some difficulties. Both Forbes and Bloomberg had lists that were nearly impossible to scrape. There was no visible body in the HTML. It was linked to a private directory that we could not access, so we resorted to a different topic - Olympic Medals Won by Country.
    
    We were able to scrape the Olympic medal data from the table off the following site: https://www.worldatlas.com/articles/countries-with-the-most-olympic-medals.html. See below for code.

    ```Web Scraping Olympic Medals by Country

    import requests
    import pandas as pd

    from splinter import Browser
    from bs4 import BeautifulSoup as bs

    executable_path = {'executable_path': '/Users/tamaranajjar/Documents/BOOTCAMP/NUCHI201905DATA2/12-Web-Scraping-and-Document-Databases/Homework/chromedriver'}
    browser = Browser('chrome', **executable_path, headless=False)

    url = 'https://www.worldatlas.com/articles/countries-with-the-most-olympic-medals.html'

    table = pd.read_html(url)
    table[0]

    writer = pd.ExcelWriter('olympics.xlsx', engine='xlsxwriter')
    df.to_excel(writer, sheet_name='List')
    writer.save()
    ```
    Converting to a CSV directly from Jupyter Notebook was not working properly so we exported to an xlsx file and saved as a CSV.

    International Military Bases: We were able to scrape this data from the following site: https://en.wikipedia.org/wiki/List_of_countries_with_overseas_military_bases. This was the most difficult site to scrape. When you scrape from a site like Wikipedia that has multiple contributors, you run into issues when inspecting the HTML. We found that not all the countries/bases were in the same div so it was difficult to iterate through and return the desired results. We found a suitable workaround but it took quite some time [KATHLEEN TO ADD DETAILS] See below for code.
    
    ```Web Scraping International Military Bases by Country
    import requests
    import pandas as pd

    from splinter import Browser
    from bs4 import BeautifulSoup as bs

    executable_path = {'executable_path': '/Users/tamaranajjar/Documents/BOOTCAMP/NUCHI201905DATA2/12-Web-Scraping-and-Document-Databases/Homework/chromedriver'}
    browser = Browser('chrome', **executable_path, headless=False)

    url = "https://en.wikipedia.org/wiki/List_of_countries_with_overseas_military_bases"
    countries = []
    browser.visit(url)
    soup = bs(browser.html, 'html.parser')

    country = []
    for span in soup.find_all('span',class_='flagicon'):
        country.append(span.parent.parent.find_previous('h2').find_next('span').text)

    base = []
    for i in range(1,18):
        list_of_lis = soup.find_all('span', class_='mw-headline')[i].parent.find_next('ul').find_all('li')
        for li in list_of_lis:
            base.append(li.next.find_next('a').text)
    
    country.pop()
    base.pop(56)

    base.append('Tunisia')
    base.append('Turkey')
    base.append('United Arab Emirates')
    base.append('United Kingdom')
    base[56] = 'Qatar'
    base.insert(57,'Somalia')
    base.insert(58,'Syria')

    military_base_df = pd.DataFrame(list(zip(country,base)),columns=['Country','Overseas Base'])
    military_base_df

    military_base_df.groupby('Country').nunique()

    military_base_df.to_csv('military_bases.csv')

    ```
STEP 3:

    Once we had the data scrapped, we had to make sure it was properly formatted so that we can utilize it in our code. Unfortunately, we had to resort to Excel for some of this. For the Olympic Medal data and the International Military Bases data we had to manually enter the lat & lng for each country in order to map it. We used the following site to get the lat & lng: https://developers.google.com/public-data/docs/canonical/countries_csv. Once our CSVs were ready, we used the following site to convert our CSVs into geojson files: https://www.onlinejsonconvert.com/csv-geojson.php.
    
    For the wine consumption data, we were able to find a geojson file that contained the outline coordinates of each country so we used that. We found that geojson file here: https://raw.githubusercontent.com/tetrahedra/worldmap/master/countries.geo.json





