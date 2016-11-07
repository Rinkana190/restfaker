// @flow
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import faker from 'faker';
import 'whatwg-fetch';


import * as actionTypes from '../actions/homePage';

const {
  HOME_PAGE_ADD_HEADER_ROW,
  HOME_PAGE_REMOVE_HEADER_ROW,
  HOME_PAGE_HEADER_EDIT_KEY,
  HOME_PAGE_HEADER_EDIT_VAL,
  HOME_PAGE_SCHEME_ADD_ROW,
  HOME_PAGE_SCHEME_REMOVE_ROW,
  HOME_PAGE_SCHEME_EDIT_KEY,
  HOME_PAGE_SCHEME_EDIT_VAL,
  HOME_PAGE_CHOOSE_METHOD,
  HOME_PAGE_CHOOSE_FETCH_METHOD,
  HOME_PAGE_CHOOSE_LOCALE,
  HOME_PAGE_EDIT_URL,
  HOME_PAGE_SEND,
  HOME_PAGE_SEND_CHOOSE_N,
  HOME_PAGE_CLEAR_RESULT,
} = actionTypes;

const mapStateToProps = (state) => ({ ...state.homePage });

const parseResponse = response => {
  const status = response.status;
  if (status === 204) {
    return { data: {} };
  } else if (status === 404) {
    return null;
  } else if (status === 400) {
    let resp = { error: false };
    resp = response.json();
    // resp.error = true;
    return resp;
  } else if (status >= 200 && status < 300) {
    return response.json();
  }
  return response.json().then(Promise.reject.bind(Promise));
};


function basicCall(url: string, query: Object) {
  return fetch(url, query).then(parseResponse).catch(data => {
    const error = new Error();
    error.message = data;
    throw error;
  });
}

@connect(mapStateToProps)
export default class Home extends Component {

  static propTypes = {
    dispatch: PropTypes.func,
    headerRows: PropTypes.arrayOf(PropTypes.object),
    schemeRows: PropTypes.arrayOf(PropTypes.object),
    results: PropTypes.arrayOf(PropTypes.object),
    n: PropTypes.string,
    fetchMode: PropTypes.string,
    method: PropTypes.string,
    url: PropTypes.string,
    fakerLocale: PropTypes.string,
    // working: PropTypes.bool,
  };

  async onBtnClick() {
    const params = {};
    const headers = {
      // Accept: 'application/json',
    };
    const hKeys = Object.keys(this.props.headerRows);
    const jsKeys = Object.keys(this.props.schemeRows);
    const { schemeRows, headerRows, n, method, fetchMode } = this.props;
    const url = `http://${this.props.url}`;

    for (let i = 0; i < hKeys.length; i += 1) {
      headers[headerRows[hKeys[i]].k] = headerRows[hKeys[i]].v;
    }

    const query = {
      mode: fetchMode,
      method,
      headers,
      body: '',
    };
    faker.locale = 'ru';
    const results = [];
    const fakeResults = [];
    for (let j = 0; j < n; j += 1) {
      for (let i = 0; i < jsKeys.length; i += 1) {
        params[schemeRows[jsKeys[i]].k] = faker.fake(`{{${schemeRows[jsKeys[i]].v}}}`);
      }
      query.body = JSON.stringify(params);
      fakeResults[j] = query;
      try {
        results[j] = await basicCall(url, query);
      } catch (e) {
        results[j] = { error: true, message: 'Query error', txt: JSON.stringify(e) };
      }
    }

    this.props.dispatch({ type: HOME_PAGE_SEND, res: fakeResults, answers: results });
  }

  onEditHeaderKey(index: Number, evt:Object) {
    const ind = index;
    const val = evt.target.value;
    this.props.dispatch({ type: HOME_PAGE_HEADER_EDIT_KEY,
      v: val,
      index: ind,
      rows: this.props.headerRows
   });
  }

  onEditHeaderVal(index: Number, evt:Object) {
    const ind = index;
    const val = evt.target.value;
    this.props.dispatch({
      type: HOME_PAGE_HEADER_EDIT_VAL,
      v: val,
      index: ind,
      rows: this.props.headerRows
    });
  }

  onEditN(evt:Object) {
    const val = evt.target.value;
    this.props.dispatch({ type: HOME_PAGE_SEND_CHOOSE_N, v: val });
  }

  onEditUrl(evt:Object) {
    const val = evt.target.value;
    this.props.dispatch({ type: HOME_PAGE_EDIT_URL, v: val });
  }

  onChoose(evt:Object) {
    const val = evt.target.value;
    this.props.dispatch({ type: HOME_PAGE_CHOOSE_METHOD, v: val });
  }

  onChooseFetch(evt:Object) {
    const val = evt.target.value;
    this.props.dispatch({ type: HOME_PAGE_CHOOSE_FETCH_METHOD, v: val });
  }

  onChooseLocale(evt:Object) {
    const val = evt.target.value;
    this.props.dispatch({ type: HOME_PAGE_CHOOSE_LOCALE, v: val });
  }

  onEditSchemeKey(index: Number, evt:Object) {
    const ind = index;
    const val = evt.target.value;
    this.props.dispatch({
      type: HOME_PAGE_SCHEME_EDIT_KEY,
      v: val,
      index: ind,
      rows: this.props.schemeRows,
    });
  }

  onEditSchemeVal(index: Number, evt:Object) {
    const ind = index;
    const val = evt.target.value;
    this.props.dispatch({
      type: HOME_PAGE_SCHEME_EDIT_VAL,
      v: val,
      index: ind,
      rows: this.props.schemeRows,
    });
  }

  onClearResults() {
    this.props.dispatch({ type: HOME_PAGE_CLEAR_RESULT });
  }

  addSchemeRow() {
    this.props.dispatch({ type: HOME_PAGE_SCHEME_ADD_ROW, rows: this.props.schemeRows });
  }

  removeSchemeRow(index: Number) {
    const ind = index;
    this.props.dispatch({ type: HOME_PAGE_SCHEME_REMOVE_ROW,
      index: ind,
      rows: this.props.schemeRows,
    });
  }

  addHeaderRow() {
    this.props.dispatch({ type: HOME_PAGE_ADD_HEADER_ROW, rows: this.props.headerRows });
  }

  removeHeaderRow(index: Number) {
    const ind = index;
    this.props.dispatch({ type: HOME_PAGE_REMOVE_HEADER_ROW,
      index: ind,
      rows: this.props.headerRows
    });
  }

  render() {
    const { headerRows, schemeRows, n, url, method,
        results, fetchMode, fakerLocale } = this.props;

    const res = JSON.stringify(results);

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="lead">
              Insert Headers, Scheme, choose request type&fetch mode and push Send.
            </h1>
          </div>
        </div>
        <div className="panel panel-success">
          <div className="panel-heading">Settings</div>
          <div className="panel-body">
            <div className="row">
              <div className="col-md-6">
                <div className="dropdown form-group">
                  <label htmlFor="fetchMode">Choose fetch mode.</label>
                  <select name="fetchMode" className="form-control" value={fetchMode} onChange={this.onChooseFetch.bind(this)}>
                    <option value="cors">cors</option>
                    <option value="same-origin">same-origin</option>
                    <option value="no-cors">no-cors</option>
                  </select>
                </div>
              </div>
              <div className="col-md-6">
                <div className="dropdown form-group">
                  <label htmlFor="fakerLocale">Choose faker Locale.</label>
                  <select name="fakerLocale" className="form-control" value={fakerLocale} onChange={this.onChooseLocale.bind(this)}>
                    <option value="de">de</option>
                    <option value="de_AT">de_AT</option>
                    <option value="de_CH">de_CH</option>
                    <option value="en">en</option>
                    <option value="en_AU">en_AU</option>
                    <option value="en_BORK">en_BORK</option>
                    <option value="en_CA">en_CA</option>
                    <option value="en_GB">en_GB</option>
                    <option value="en_IE">en_IE</option>
                    <option value="en_IND">en_IND</option>
                    <option value="en_US">en_US</option>
                    <option value="en_au_ocker">en_au_ocker</option>
                    <option value="es">es</option>
                    <option value="es_MX">es_MX</option>
                    <option value="fa">fa</option>
                    <option value="fr">fr</option>
                    <option value="fr_CA">fr_CA</option>
                    <option value="ge">ge</option>
                    <option value="id_ID">id_ID</option>
                    <option value="it">it</option>
                    <option value="ja">ja</option>
                    <option value="ko">ko</option>
                    <option value="nb_NO">nb_NO</option>
                    <option value="nep">nep</option>
                    <option value="nl">nl</option>
                    <option value="pl">pl</option>
                    <option value="pt_BR">pt_BR</option>
                    <option value="ru">ru</option>
                    <option value="sk">sk</option>
                    <option value="sv">sv</option>
                    <option value="tr">tr</option>
                    <option value="uk">uk</option>
                    <option value="vi">vi</option>
                    <option value="zh_CN">zh_CN</option>
                    <option value="zh_TW">zh_TW</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="panel panel-info">
          <div className="panel-heading">Request params</div>
          <div className="panel-body">
            <div className="row">
              <div className="col-md-4">
                <div className="row">
                  <h2 style={{ marginBottom: 5 }}>Headers</h2>
                  {
                      headerRows.map((row, index) => (
                        <div className="row" key={index} style={{ padding: 5 }}>
                          <div className="col-md-4">
                            <input type="text" className="form-control" placeholder="key" value={row.k} onChange={this.onEditHeaderKey.bind(this, index)} />
                          </div>
                          <div className="col-md-6">
                            <input type="text" className="form-control btn-block" placeholder="value" value={row.v} onChange={this.onEditHeaderVal.bind(this, index)} />
                          </div>
                          <div className="col-md-2">
                            <button className="btn-xs btn-danger glyphicon glyphicon-remove" onClick={this.removeHeaderRow.bind(this, index)} />
                          </div>
                        </div>
                      ))
                  }
                  <div className="row" style={{ marginTop: 20 }}>
                    <div className="col-md-12">
                      <button type="button" className="btn btn-default pull-right" onClick={this.addHeaderRow.bind(this)}>Add header</button>
                    </div>
                  </div>
                </div>
                <div className="row pullUp10" style={{ marginTop: 20 }}>
                  <h2 style={{ marginBottom: 5 }} className="pullRight5">Scheme</h2>
                  {
                      schemeRows.map((row, index) => (
                        <div className="row" key={index} style={{ padding: 5 }}>
                          <div className="col-md-4">
                            <input type="text" className="form-control" placeholder="key" value={row.k} onChange={this.onEditSchemeKey.bind(this, index)} />
                          </div>
                          <div className="col-md-6">
                            <select className="form-control" value={row.v} onChange={this.onEditSchemeVal.bind(this, index)}>
                              <option value="address.zipCode">address.zipCode</option>
                              <option value="address.city">address.city</option>
                              <option value="address.cityPrefix">address.cityPrefix</option>
                              <option value="address.citySuffix">address.citySuffix</option>
                              <option value="address.streetName">address.streetName</option>
                              <option value="address.streetAddress">address.streetAddress</option>
                              <option value="address.streetSuffix">address.streetSuffix</option>
                              <option value="address.streetPrefix">address.streetPrefix</option>
                              <option value="address.secondaryAddress">address.secondaryAddress</option>
                              <option value="address.county">address.county</option>
                              <option value="address.country">address.country</option>
                              <option value="address.countryCode">address.countryCode</option>
                              <option value="address.state">address.state</option>
                              <option value="address.stateAbbr">address.stateAbbr</option>
                              <option value="address.latitude">address.latitude</option>
                              <option value="address.longitude">address.longitude</option>
                              <option value="commerce.color">commerce.color</option>
                              <option value="commerce.department">commerce.department</option>
                              <option value="commerce.productName">commerce.productName</option>
                              <option value="commerce.price">commerce.price</option>
                              <option value="commerce.productAdjective">commerce.productAdjective</option>
                              <option value="commerce.productMaterial">commerce.productMaterial</option>
                              <option value="commerce.product">commerce.product</option>
                              <option value="company.suffixes">company.suffixes</option>
                              <option value="company.companyName">company.companyName</option>
                              <option value="company.companySuffix">company.companySuffix</option>
                              <option value="company.catchPhrase">company.catchPhrase</option>
                              <option value="company.bs">company.bs</option>
                              <option value="company.catchPhraseAdjective">company.catchPhraseAdjective</option>
                              <option value="company.catchPhraseDescriptor">company.catchPhraseDescriptor</option>
                              <option value="company.catchPhraseNoun">company.catchPhraseNoun</option>
                              <option value="company.bsAdjective">company.bsAdjective</option>
                              <option value="company.bsBuzz">company.bsBuzz</option>
                              <option value="company.bsNoun">company.bsNoun</option>
                              <option value="date.past">date.past</option>
                              <option value="date.future">date.future</option>
                              <option value="date.between">date.between</option>
                              <option value="date.recent">date.recent</option>
                              <option value="date.month">date.month</option>
                              <option value="date.weekday">date.weekday</option>
                              <option value="finance.account">finance.account</option>
                              <option value="finance.accountName">finance.accountName</option>
                              <option value="finance.mask">finance.mask</option>
                              <option value="finance.amount">finance.amount</option>
                              <option value="finance.transactionType">finance.transactionType</option>
                              <option value="finance.currencyCode">finance.currencyCode</option>
                              <option value="finance.currencyName">finance.currencyName</option>
                              <option value="finance.currencySymbol">finance.currencySymbol</option>
                              <option value="finance.bitcoinAddress">finance.bitcoinAddress</option>
                              <option value="hacker.abbreviation">hacker.abbreviation</option>
                              <option value="hacker.adjective">hacker.adjective</option>
                              <option value="hacker.noun">hacker.noun</option>
                              <option value="hacker.verb">hacker.verb</option>
                              <option value="hacker.ingverb">hacker.ingverb</option>
                              <option value="hacker.phrase">hacker.phrase</option>
                              <option value="helpers.randomize">helpers.randomize</option>
                              <option value="helpers.slugify">helpers.slugify</option>
                              <option value="helpers.replaceSymbolWithNumber">helpers.replaceSymbolWithNumber</option>
                              <option value="helpers.replaceSymbols">helpers.replaceSymbols</option>
                              <option value="helpers.shuffle">helpers.shuffle</option>
                              <option value="helpers.mustache">helpers.mustache</option>
                              <option value="helpers.createCard">helpers.createCard</option>
                              <option value="helpers.contextualCard">helpers.contextualCard</option>
                              <option value="helpers.userCard">helpers.userCard</option>
                              <option value="helpers.createTransaction">helpers.createTransaction</option>
                              <option value="image.image">image.image</option>
                              <option value="image.avatar">image.avatar</option>
                              <option value="image.imageUrl">image.imageUrl</option>
                              <option value="image.abstract">image.abstract</option>
                              <option value="image.animals">image.animals</option>
                              <option value="image.business">image.business</option>
                              <option value="image.cats">image.cats</option>
                              <option value="image.city">image.city</option>
                              <option value="image.food">image.food</option>
                              <option value="image.nightlife">image.nightlife</option>
                              <option value="image.fashion">image.fashion</option>
                              <option value="image.people">image.people</option>
                              <option value="image.nature">image.nature</option>
                              <option value="image.sports">image.sports</option>
                              <option value="image.technics">image.technics</option>
                              <option value="image.transport">image.transport</option>
                              <option value="internet.avatar">internet.avatar</option>
                              <option value="internet.email">internet.email</option>
                              <option value="internet.exampleEmail">internet.exampleEmail</option>
                              <option value="internet.userName">internet.userName</option>
                              <option value="internet.protocol">internet.protocol</option>
                              <option value="internet.url">internet.url</option>
                              <option value="internet.domainName">internet.domainName</option>
                              <option value="internet.domainSuffix">internet.domainSuffix</option>
                              <option value="internet.domainWord">internet.domainWord</option>
                              <option value="internet.ip">internet.ip</option>
                              <option value="internet.userAgent">internet.userAgent</option>
                              <option value="internet.color">internet.color</option>
                              <option value="internet.mac">internet.mac</option>
                              <option value="internet.password">internet.password</option>
                              <option value="lorem.word">lorem.word</option>
                              <option value="lorem.words">lorem.words</option>
                              <option value="lorem.sentence">lorem.sentence</option>
                              <option value="lorem.sentences">lorem.sentences</option>
                              <option value="lorem.paragraph">lorem.paragraph</option>
                              <option value="lorem.paragraphs">lorem.paragraphs</option>
                              <option value="lorem.text">lorem.text</option>
                              <option value="lorem.lines">lorem.lines</option>
                              <option value="name.firstName">name.firstName</option>
                              <option value="name.lastName">name.lastName</option>
                              <option value="name.findName">name.findName</option>
                              <option value="name.jobTitle">name.jobTitle</option>
                              <option value="name.prefix">name.prefix</option>
                              <option value="name.suffix">name.suffix</option>
                              <option value="name.title">name.title</option>
                              <option value="name.jobDescriptor">name.jobDescriptor</option>
                              <option value="name.jobArea">name.jobArea</option>
                              <option value="name.jobType">name.jobType</option>
                              <option value="phone.phoneNumber">phone.phoneNumber</option>
                              <option value="phone.phoneNumberFormat">phone.phoneNumberFormat</option>
                              <option value="phone.phoneFormats">phone.phoneFormats</option>
                              <option value="random.number">random.number</option>
                              <option value="random.arrayElement">random.arrayElement</option>
                              <option value="random.objectElement">random.objectElement</option>
                              <option value="random.uuid">random.uuid</option>
                              <option value="random.boolean">random.boolean</option>
                              <option value="random.word">random.word</option>
                              <option value="random.words">random.words</option>
                              <option value="random.image">random.image</option>
                              <option value="random.locale">random.locale</option>
                              <option value="random.alphaNumeric">random.alphaNumeric</option>
                              <option value="system.fileName">system.fileName</option>
                              <option value="system.commonFileName">system.commonFileName</option>
                              <option value="system.mimeType">system.mimeType</option>
                              <option value="system.commonFileType">system.commonFileType</option>
                              <option value="system.commonFileExt">system.commonFileExt</option>
                              <option value="system.fileType">system.fileType</option>
                              <option value="system.fileExt">system.fileExt</option>
                              <option value="system.directoryPath">system.directoryPath</option>
                              <option value="system.filePath">system.filePath</option>
                              <option value="system.semver">system.semver</option>
                            </select>
                          </div>
                          <div className="col-md-2">
                            <button className="btn-xs btn-danger glyphicon glyphicon-remove" onClick={this.removeSchemeRow.bind(this, index)} />
                          </div>
                        </div>
                      ))
                  }
                  <div className="row" style={{ marginTop: 20 }}>
                    <div className="col-md-12">
                      <button type="button" className="btn btn-default pull-right" onClick={this.addSchemeRow.bind(this)}>Add key-value</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <h2 style={{ marginBottom: 5 }} className="pullRight5">Request</h2>
                <div className="row">
                  <div className="col-md-3">
                    <div className="dropdown">
                      <select className="form-control" value={method} onChange={this.onChoose.bind(this)}>
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PATCH">PATCH</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="input-group">
                      <span className="input-group-addon" id="basic-addon3">https://</span>
                      <input type="text" className="form-control" value={url} onChange={this.onEditUrl.bind(this)} id="basic-url" aria-describedby="basic-addon3" />
                    </div>
                  </div>
                  <div className="col-md-1" style={{ padding: 0 }} >
                    <input type="text" className="form-control" value={n} onChange={this.onEditN.bind(this)} />
                  </div>
                  <div className="col-md-2">
                    <button type="button" className="btn btn-default btn-danger" onClick={this.onBtnClick.bind(this)}>Send</button>
                  </div>
                </div>
                <div className="row" style={{ marginTop: 20 }}>
                  <div className="col-md-12">
                    <textarea className="col-md-12 form-control" value={res} readOnly style={{ minHeight: 250 }} />
                  </div>
                </div>
                <div className="row" style={{ marginTop: 20 }}>
                  <div className="col-md-12">
                    <button type="button" className="btn btn-default btn-danger pull-right" onClick={this.onClearResults.bind(this)}>Clear</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
