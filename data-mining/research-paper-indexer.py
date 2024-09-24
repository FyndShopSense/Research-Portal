import time
from elasticsearch import helpers
import logging
import json

from elasticsearch import Elasticsearch
logging.basicConfig(level=logging.ERROR)
start_time = time.time()


def connect_elasticsearch(url = 'localhost', port = 9200):
    _es = None
    _es = Elasticsearch([{'host': url, 'port': port}])
    if _es.ping():
        print('Connection to ' + url + ':' + str(port) + ' successful')
    else:
        print('Ping failed, some error in connection. Check the logs')
    return _es


es = connect_elasticsearch()

def delete_index(index):
    es.indices.delete(index=index, ignore=[400, 404])
# delete_index("research_portal")


def yield_record(file_path, encoding="utf8"):
    line_counter = 0
    with open(file_path, encoding=encoding) as f:
        for line in f:
            single_record = json.loads(line)
            
            line_counter = line_counter + 1
            paper_id = single_record['id']
            single_record['referenceCount'] = len(single_record['outCitations'])
            single_record["citationCount"] = len(single_record['inCitations'])
           
            single_record['relatedTopics'] = single_record.pop('entities')
            
            if line_counter % 10000:
                print(line_counter)
#                 single_record["relatedTopics"] = ["kushan", "mehta"]
            
            
            del single_record['id']
            del single_record['s2Url']
#             del single_record['inCitations']
#             del single_record['outCitations']
            del single_record['sources']
            del single_record["magId"]
            for author in single_record['authors']:
                del author['ids']
                
#             print(single_record)
#             print("")
            yield paper_id, single_record
           

    print("Inserted total " + str(line_counter) + " lines")



def es_add_bulk(file_path):
    papers = ({
        "_index": "research_portal",
        "_type": "research_papers",
        "_id": paper_id,
        "_source": paper_record,
    } for paper_id, paper_record in yield_record(file_path))

    helpers.bulk(es, papers)


delete_index("research_portal")


mappings = {
    "settings":{
        "index": {
            "number_of_shards": 3,
            "number_of_replicas":1,
            "codec": "best_compression"
        }
    },
     "mappings": {
         "research_papers":{
             "properties": {
                 "title": {
                    "type": "text"
                  },
#                  "authors":{
#                      "type": "keyword"
#                  },
                  "citationCount": {
                    "type": "integer",
                    "index": False
                  },
                 "referenceCount": {
                    "type": "integer",
                    "index": False
                  },
                  "year": {
                    "type": "integer",
                  },
#                   "journalName": {
#                     "type": "keyword"
#                   },
                  "doi": {
                    "type": "keyword",
                  },
                  "doiUrl": {
                    "type": "keyword",
                    "index": False
                  },
                  "journalPages": {
                    "type": "keyword",
                    "index": False
                  },
                  "journalVolume": {
                    "type": "keyword",
                    "index": False
                  },
                  "paperAbstract": {
                    "type": "text",
                    "index": False
                  },
                  "pdfUrls": {
                    "type": "keyword",
                    "index": False
                  },
                  "s2PdfUrl": {
                    "type": "keyword",
                    "index": False
                  },
                  "venue": {
                    "type": "keyword",
                    "index": False
                  },
#                  "fieldsOfStudy":{
#                      "type": "keyword"
#                  },
#                  "relatedTopics":{
#                      "type": "keyword"
#                  }
            }
        }
     }
}
es.indices.create(index='research_portal', ignore=400, body=mappings)
# curl -XGET localhost:9200/_cat/indices?v
# ^ Get size of each index

# Load the data from file to database
# es_add_bulk("/home/kushan/Development/Python/Projects/SIH 2020 Research Portal/ElasticSearch_Insertion/cleaned-test/cleaned_records.txt")
for file_number in range(0, 54):
    file_name = "clean-corpus-{}".format(file_number)
    if file_number < 10:
        file_name = "clean-corpus-0{}".format(file_number)

    file_name = "/data/cleaned/" + file_name

    print(file_name)
    print("")

    es_add_bulk(file_name)


_execution_time = round(time.time() - start_time, 2) # in seconds
print("Execution Time: --- %s minutes (%s seconds) ---" % (round(_execution_time/60,2) , _execution_time))

