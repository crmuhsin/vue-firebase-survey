export const searchFn = {
    mySearch(search, items){
        let input = search.toLowerCase();
        let list = [];
        let pos = -1;
        let los = -1;
        if (input == "") {
            return items;
        }
        else {
            items.forEach(item => {
                pos = item['surveyname'].indexOf(input);
                los = item['slug'].indexOf(input);
                if (pos != -1 || los != -1) {
                    list.push(item)
                }
                pos = los = -1;
            });
            return list;
        }
    },
    mySearchRes(search, items){
        let input = search.toLowerCase();
        let list = [];
        let pos = -1;
        let los = -1;
        if (input == "") {
            return items;
        }
        else {
            items.forEach(item => {
                pos = item['responder'].indexOf(input);
                los = item['email'].indexOf(input);
                if (pos != -1 || los != -1) {
                    list.push(item)
                }
                pos = los = -1;
            });
            return list;
        }
    }
}

