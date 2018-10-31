const search = async (model, fieldsToSearch=[], searchText='', page) => {
        try {
            const conditions = {};

            if (searchText) {
                // split the search into words, filtering out empty strings
                const searchWords = searchText.split(' ').filter(word => word);

                // build a regex for each word
                const regexWords = searchWords.map(word => {
                    return { $regex: word, $options: 'i' }
                });

                // for each attribute, see if it matches a word
                const queries = regexWords.reduce((result, wordQuery) => {
                    const queriesForWord = fieldsToSearch.map(field => {
                        return { [field]: wordQuery };
                    }, []);

                    result.push({ '$or': queriesForWord });
                    return result;
                }, []);

                conditions['$and'] = queries;
            }

            console.log("QUERY:", JSON.stringify(conditions));

            const results = await model.find({ conditions, page })
            return results.map(item => ({ ...item, id: item._id || item.id}))
        } catch (err) {
            console.error(`Error while searching:`, err)
        }
}

export default search;

