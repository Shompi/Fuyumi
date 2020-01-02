class POTD {
  //NASA constructor para PIC OF THE DAY API
  constructor(picResponse){
    this.date = picResponse.date;
    this.explanation = picResponse.explanation;
    this.hdurl = picResponse.hdurl;
    this.media_type = picResponse.media_type;
    this.service_version = picResponse.service_version;
    this.title = picResponse.title;
    this.url = picResponse.url;
  }
}

module.exports = {POTD}