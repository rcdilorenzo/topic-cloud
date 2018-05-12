// import registerServiceWorker from './registerServiceWorker';
// registerServiceWorker();


import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from './store';
import App from './containers/app';
import * as d3 from 'd3';
import d3Cloud from 'd3-cloud';
import { filter, find, propEq, not, pipe } from 'ramda';

import './index.css';

// BEGIN D3 SPIKE

function drawCloud(d3Element, topics, update, opts) {
  const data = topics.map(el => {
    return { ...el, size: el.votes};
  });

  const maxSize = d3.max(data, d => d.size);

  const sizeScale = d3.scaleLinear()
        .domain([0, maxSize])
        .range([2, opts.maxFontSize]);

  const colorScale = d3.scaleLinear()
    .domain([0, maxSize])
        .range(['#CB4335', '#34495E']);

  const wordHover = function (d, i) {
    d3.select(this).classed('word--active', true);
  };

  const wordHoverOut = function (d, i) {
    d3.select(this).classed('word--active', false);
  };

  const wordClicked = function() {
    const id = parseInt(this.dataset.id);
    update(id);
  };

  const drawWords = function (words, e) {
    console.log('drawing');
    console.log(e);
    console.log(words);
    d3Element
      .attr('id', 'wordCloudG')
      .attr('transform', `translate(${opts.width / 2}, ${opts.height / 2})`);

    d3Element.selectAll('text')
      .data(words)
      .enter()
      .append('text')
      .attr('class', 'word')
      .on('mouseover', wordHover)
      .on('mouseout', wordHoverOut)
      .on('click', wordClicked)
      .style('user-select', 'none')
      .style('font-size', d => d.size)
      .style('fill', d => colorScale(d.size))
      .attr('data-id', d => d.id)
      .attr('text-anchor', 'middle')
      .attr('transform', d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
      .text(d => d.text);
  };

  return d3Cloud()
    .random(opts.seed)
    .size([opts.width, opts.height])
    .words(data)
    .rotate(0)
    .fontSize(d => sizeScale(d.size))
    .on('end', drawWords)
    .start();
};

let wordG = d3.select('svg').append('g');

const seed = Math.random();

const opts = {
  width: 500,
  height: 300,
  maxFontSize: 72,
  seed: () => seed
};

let topics = [
  {id: 243, text: 'Elixir', votes: 50},
  {id: 524, text: 'Ruby', votes: 20},
  {id: 423, text: 'JavaScript', votes: 30},
  {id: 562, text: 'Haskell', votes: 65},
  {id: 231, text: 'Python', votes: 15}
];

const addOne = (id) => {
  const predicate = propEq('id', id);
  const item = find(predicate, topics);
  const remaining = filter(pipe(predicate, not), topics);

  topics =  [
    ...remaining,
    { ...item, votes: item.votes + 1 }
  ];

  wordG = document.getElementById('wordCloudG');
  wordG.parentElement.removeChild(wordG);
  wordG = d3.select('svg').append('g');

  cloud.stop();
  cloud = drawCloud(wordG, topics, addOne, opts);
};

let cloud = drawCloud(wordG, topics, addOne, opts);

// END D3 SPIKE

const target = document.querySelector('#root');

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <App />
      </div>
    </ConnectedRouter>
  </Provider>,
  target
);
