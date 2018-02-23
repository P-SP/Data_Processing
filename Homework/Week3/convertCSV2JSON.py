#!/usr/bin/env python
# Name: Puja Chandrikasingh
# Student number: 11059842
"""
This script converts data in a csv file to a json file.
"""

import csv
import json

def convertToJson(file):
    """
    This function converts the data in a csv file of the KNMI to a json file.
    """
	
    with open(file, 'r') as csv_file:
        csv_reader = csv.DictReader(csv_file, delimiter= ",")
        title = csv_reader.fieldnames
        
        # make title layout nice (first letter upercase, rest lowercase)
        for i in range(len(title)):
            title[i] = title[i].strip().lower().capitalize()
        
        data_for_json = []
        
        for row in csv_reader:
            # first find the right year and extract then the data
            if row[title[1]] == '1997':
                for i in range(2, len(title) - 1):
                    data_for_json.extend([{"Date":title[i].strip(), 
                                           "Temp" : row[title[i]].strip()}])
            
        # save the data as json
        with open("data.json", "w") as j:
            j.write(json.dumps(data_for_json, indent = 4))        


if __name__ == "__main__":
    # get the csv file and call the convert function
    convertToJson("D:/Econometrie/Jaar 3/Semester 2/Data Processing/data2.csv")
    