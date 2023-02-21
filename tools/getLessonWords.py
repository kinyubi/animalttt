import json


def extract_data(filename) -> dict:
    with open(filename, 'r') as fp:
        content = json.load(fp)
    table = content[2]
    lessons: list = table['data']
    lessons_dict: dict = {}
    lessons_list = []
    for lesson in lessons:
        lesson_id = lesson.get('lessonId')
        name = lesson.get('lessonName')
        word_str= lesson.get('wordList')
        if lesson_id is not None and word_str is not None:
            words = [x.strip() for x in word_str.split(',')]
            lessons_dict[lesson_id] = {'id': lesson_id, 'name': name, 'words': words}
            lessons_list.append(words)
    with open('lesson_words.json', 'w') as fp:
        json.dump(lessons_dict, fp)
    with open('ttt_words.json', 'w') as fp:
        json.dump(lessons_list, fp)


if __name__ == '__main__':
    extract_data('abc_lessons.json')
