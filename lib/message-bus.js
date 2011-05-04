var EventEmitter = require('events').EventEmitter,
    redis = require("redis");

module.exports.MessageBus = MessageBus;

MessageBus.prototype.__proto__ = EventEmitter.prototype;

function MessageBus(channel) {
  this.pub = redis.createClient();
  this.sub = redis.createClient();
  this.channel = channel;
  
  var self = this;
  this.pub.on("error", function (err) {
    self._onError(err);
  });
  this.sub.on("error", function (err) {
    self._onError(err);
  });
  this.sub.on("message", function(channel, message) {
    self._onMessage(message, channel);
  });
  this.sub.subscribe(channel);
}

MessageBus.prototype.send = function(message) {
  this.pub.publish(this.channel, message);
}

MessageBus.prototype.end = function(message) {
  this.sub.unsubscribe("chat");
  this.sub.quit();
  this.pub.quit();
}

MessageBus.prototype._onError = function(error) {
  this.emit("error", error);
}

MessageBus.prototype._onMessage = function(message, channel) {
  this.emit("message", message, channel);
}
