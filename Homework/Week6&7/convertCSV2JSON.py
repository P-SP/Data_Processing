#!/usr/bin/env python
# Name: Puja Chandrikasingh
# Student number: 11059842
"""
This script converts data in a csv file to a json file.
"""

import csv
import json

"""
This function converts the data of the CBS of one year in a csv file to 
a json file.
"""
def convertToJson(file):
    with open(file, 'r') as csv_file:
        csv_reader = csv.DictReader(csv_file, delimiter= ";")
        
        data_total = []
        data_male = []
        data_female = []
        
        for row in csv_reader:
            if row["Geslacht"] == "Totaal":
                data_total.extend([{"Kind" : row["Kenmerken van personen"], 
                                    "Values" : {"Min1yr" : row["Ten minste 1 jaar"], 
                                                "Min4yr" : row["Vier jaar of langer"]}}])
            if row["Geslacht"] == "Mannen":
                data_male.extend([{"Kind" : row["Kenmerken van personen"], 
                                    "Values" : {"Min1yr" : row["Ten minste 1 jaar"], 
                                                "Min4yr" : row["Vier jaar of langer"]}}])
            if row["Geslacht"] == "Vrouwen":
                data_female.extend([{"Kind" : row["Kenmerken van personen"], 
                                    "Values" : {"Min1yr" : row["Ten minste 1 jaar"], 
                                                "Min4yr" : row["Vier jaar of langer"]}}])

        data_for_json = [{"Gender" : "Total", "Value" : data_total}, 
                         {"Gender" : "Male", "Value" : data_male}, 
                         {"Gender" : "Female", "Value" : data_female}]
        
        # save the data as json
        with open("2016.json", "w") as j:
            json.dump(data_for_json, j, indent = 4)
            
if __name__ == "__main__":
    # get the csv file and call the convert function
    convertToJson("C:/Users/Eigenaar/Documents/GitHub/Data_Processing/Homework/Week6&7/2016_2.csv")
    