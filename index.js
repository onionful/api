import hapiLambda from 'hapi-lambda';
import api from './api';

hapiLambda.configure([api]);
module.exports.hello = hapiLambda.handler;
