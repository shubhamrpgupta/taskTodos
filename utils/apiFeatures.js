class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;   
        this.queryStr = queryStr;   

    }

    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skipTask = resultPerPage * (currentPage - 1);

        this.query = this.query.limit(resultPerPage).skip(skipTask);

        return this;
    }


}
