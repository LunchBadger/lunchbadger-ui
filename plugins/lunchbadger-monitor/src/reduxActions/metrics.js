import Metric, {getRandomInt} from '../models/Metric';
import MetricBundle from '../models/MetricBundle';
import MetricPair, {OR} from '../models/MetricPair';
import {actions} from './actions';

export const create = (entity, left, top) => dispatch =>
  dispatch(actions.updateMetric(
    MetricBundle.create({
      pairs: [
        MetricPair.create({
          metricOne: Metric.create({entity}),
          type: OR,
        }),
      ],
      left: left || 0,
      top: top || 0
    }),
  ));

export const createBundle = (items, left, top) => (dispatch) => {
  let pairs = [];
  if (items.length === 1) {
    pairs = [
      MetricPair.create({
        metricOne: Metric.create({entity: items[0]}),
        type: OR,
      }),
    ];
  }
  if (items.length === 2) {
    pairs = [
      MetricPair.create({
        metricOne: Metric.create({entity: items[0]}),
        metricTwo: Metric.create({entity: items[1]}),
        type: OR,
      }),
    ];
  }
  if (items.length === 4) {
    pairs = [
      MetricPair.create({
        metricOne: Metric.create({entity: items[0]}),
        metricTwo: Metric.create({entity: items[1]}),
        type: OR,
      }),
      MetricPair.create({
        metricOne: Metric.create({entity: items[2]}),
        metricTwo: Metric.create({entity: items[3]}),
        type: OR,
      }),
    ];
  }
  dispatch(actions.updateMetric(
    MetricBundle.create({
      pairs: pairs,
      left: left || 0,
      top: top || 0
    })
  ));
};

export const update = (metric, left, top) => dispatch => {
  const updatedMetric = metric.recreate();
  updatedMetric.left = left;
  updatedMetric.top = top;
  dispatch(actions.updateMetric(updatedMetric));
};

export const aggregate = (bundleOne, bundleTwo) => dispatch => {
  const updatedBundleOne = bundleOne.recreate();
  if (!bundleTwo.pairs[0].metricTwo) {
    updatedBundleOne.pairs[0].metricTwo = bundleTwo.pairs[0].metricOne;
  } else if (bundleTwo.pairs[0].metricTwo) {
    updatedBundleOne.addMetricPair(bundleTwo.pairs[0]);
  }
  dispatch(actions.updateMetric(updatedBundleOne));
  dispatch(actions.removeMetric(bundleTwo));
};

export const remove = metric => dispatch => dispatch(actions.removeMetric(metric));

export const changeType = (metric, pairId, type) => dispatch => {
  const updatedMetric = metric.recreate();
  const pair = updatedMetric.findPair(pairId);
  if (pair) {
    pair.type = type;
    dispatch(actions.updateMetric(updatedMetric));
  }
};

export const simulateWebTraffic = () => (dispatch, getState) => {
  const {metrics} = getState().entities;
  const updates = [];
  Object.keys(metrics).forEach(key => {
    const updatedMetric = metrics[key].recreate();
    updatedMetric.pairs.forEach((pair) => {
      if (pair.metricOne) {
        pair.metricOne.details.forEach((detail) => {
          detail.value += getRandomInt(0, 20);
        });
      }
      if (pair.metricTwo) {
        pair.metricTwo.details.forEach((detail) => {
          detail.value += getRandomInt(0, 20);
        });
      }
    });
    updates.push(updatedMetric);
  });
  dispatch(actions.updatedMetrics(updates));
};
