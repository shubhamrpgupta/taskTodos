class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;   //this.query is Task.find()
        this.queryStr = queryStr;   //this.quertStr is query String

    }

    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skipProduct = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skipProduct);

        return this;
    }


}

module.exports = ApiFeatures;