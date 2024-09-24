# from langdetect import detect
def isEnglish(s):
#     return detect(s) == 'en'
    try:
        s = s.replace('–', '-')
        s = s.replace('—', '-')
        s = s.replace('“', '""')
        s = s.replace('”', '"')
        s = s.replace("’", "'")
        s.encode(encoding='utf-8').decode('ascii')
    except UnicodeDecodeError:
        return False
    else:
        return True


non_english = 0


def is_valid_paper(paper):
    global non_english
    try:
        if ('title' not in paper) or ('paperAbstract' not in paper) or ('year' not in paper) or (
                'authors' not in paper):
            return False
        if (not paper['title']) or (not paper['paperAbstract']) or (not paper['year']) or (not paper['authors']):
            return False
        #         if not isEnglish(paper['paperAbstract']):
        if not isEnglish(paper['title']):
            #             print(paper['title'])
            #             print("")
            non_english += 1
            return False
        if int(paper['year']) <= 2000:
            return False
    except:
        return False

    return True


import json

# file_path = "/home/kushan/Downloads/Compressed/semantic-scholar-sample.json"

total_records = 0
invalid_records = 0

with open('cleaned-test/cleaned_records.txt', 'a', encoding='utf-8') as output_file:
    for file_number in range(0, 1):
        file_name = "s2-corpus-{}".format(file_number)
        if file_number < 10:
            file_name = "s2-corpus-00{}".format(file_number)
        elif file_number < 100:
            file_name = "s2-corpus-0{}".format(file_number)

        file_name = "test-files/" + file_name

        print(file_name)

        with open(file_name, encoding='utf-8') as f:
            for line in f:
                total_records += 1
                single_record = json.loads(line)

                if not is_valid_paper(single_record):
                    invalid_records += 1
                    continue

                output_file.write("{}".format(line))

print("\n\n================================")
print("Total Records =", total_records)
print("Non Valid =", invalid_records)
print("Non English =", non_english)
print("Records Written =", total_records - invalid_records)