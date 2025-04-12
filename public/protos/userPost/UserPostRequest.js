/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const tieba = $root.tieba = (() => {

    /**
     * Namespace tieba.
     * @exports tieba
     * @namespace
     */
    const tieba = {};

    tieba.userPost = (function() {

        /**
         * Namespace userPost.
         * @memberof tieba
         * @namespace
         */
        const userPost = {};

        userPost.UserPostRequest = (function() {

            /**
             * Properties of a UserPostRequest.
             * @memberof tieba.userPost
             * @interface IUserPostRequest
             * @property {tieba.userPost.IUserPostRequestData|null} [data] UserPostRequest data
             */

            /**
             * Constructs a new UserPostRequest.
             * @memberof tieba.userPost
             * @classdesc Represents a UserPostRequest.
             * @implements IUserPostRequest
             * @constructor
             * @param {tieba.userPost.IUserPostRequest=} [properties] Properties to set
             */
            function UserPostRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * UserPostRequest data.
             * @member {tieba.userPost.IUserPostRequestData|null|undefined} data
             * @memberof tieba.userPost.UserPostRequest
             * @instance
             */
            UserPostRequest.prototype.data = null;

            /**
             * Creates a new UserPostRequest instance using the specified properties.
             * @function create
             * @memberof tieba.userPost.UserPostRequest
             * @static
             * @param {tieba.userPost.IUserPostRequest=} [properties] Properties to set
             * @returns {tieba.userPost.UserPostRequest} UserPostRequest instance
             */
            UserPostRequest.create = function create(properties) {
                return new UserPostRequest(properties);
            };

            /**
             * Encodes the specified UserPostRequest message. Does not implicitly {@link tieba.userPost.UserPostRequest.verify|verify} messages.
             * @function encode
             * @memberof tieba.userPost.UserPostRequest
             * @static
             * @param {tieba.userPost.IUserPostRequest} message UserPostRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UserPostRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                    $root.tieba.userPost.UserPostRequestData.encode(message.data, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified UserPostRequest message, length delimited. Does not implicitly {@link tieba.userPost.UserPostRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof tieba.userPost.UserPostRequest
             * @static
             * @param {tieba.userPost.IUserPostRequest} message UserPostRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UserPostRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a UserPostRequest message from the specified reader or buffer.
             * @function decode
             * @memberof tieba.userPost.UserPostRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {tieba.userPost.UserPostRequest} UserPostRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UserPostRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.tieba.userPost.UserPostRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.data = $root.tieba.userPost.UserPostRequestData.decode(reader, reader.uint32());
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a UserPostRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof tieba.userPost.UserPostRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {tieba.userPost.UserPostRequest} UserPostRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UserPostRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a UserPostRequest message.
             * @function verify
             * @memberof tieba.userPost.UserPostRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UserPostRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.data != null && message.hasOwnProperty("data")) {
                    let error = $root.tieba.userPost.UserPostRequestData.verify(message.data);
                    if (error)
                        return "data." + error;
                }
                return null;
            };

            /**
             * Creates a UserPostRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof tieba.userPost.UserPostRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {tieba.userPost.UserPostRequest} UserPostRequest
             */
            UserPostRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.tieba.userPost.UserPostRequest)
                    return object;
                let message = new $root.tieba.userPost.UserPostRequest();
                if (object.data != null) {
                    if (typeof object.data !== "object")
                        throw TypeError(".tieba.userPost.UserPostRequest.data: object expected");
                    message.data = $root.tieba.userPost.UserPostRequestData.fromObject(object.data);
                }
                return message;
            };

            /**
             * Creates a plain object from a UserPostRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof tieba.userPost.UserPostRequest
             * @static
             * @param {tieba.userPost.UserPostRequest} message UserPostRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UserPostRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.data = null;
                if (message.data != null && message.hasOwnProperty("data"))
                    object.data = $root.tieba.userPost.UserPostRequestData.toObject(message.data, options);
                return object;
            };

            /**
             * Converts this UserPostRequest to JSON.
             * @function toJSON
             * @memberof tieba.userPost.UserPostRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UserPostRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for UserPostRequest
             * @function getTypeUrl
             * @memberof tieba.userPost.UserPostRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            UserPostRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/tieba.userPost.UserPostRequest";
            };

            return UserPostRequest;
        })();

        userPost.UserPostRequestData = (function() {

            /**
             * Properties of a UserPostRequestData.
             * @memberof tieba.userPost
             * @interface IUserPostRequestData
             * @property {number|Long|null} [uid] UserPostRequestData uid
             * @property {number|null} [rn] UserPostRequestData rn
             * @property {number|null} [offset] UserPostRequestData offset
             * @property {number|null} [isThread] UserPostRequestData isThread
             * @property {number|null} [needContent] UserPostRequestData needContent
             * @property {number|Long|null} [forumId] UserPostRequestData forumId
             * @property {number|null} [beginTime] UserPostRequestData beginTime
             * @property {number|null} [endTime] UserPostRequestData endTime
             * @property {number|null} [subtype] UserPostRequestData subtype
             * @property {number|null} [checkLogin] UserPostRequestData checkLogin
             * @property {string|null} [ipStr] UserPostRequestData ipStr
             * @property {number|null} [ipInt] UserPostRequestData ipInt
             * @property {string|null} [moduleName] UserPostRequestData moduleName
             * @property {number|null} [stType] UserPostRequestData stType
             * @property {number|null} [stParam] UserPostRequestData stParam
             * @property {number|null} [smileGrade] UserPostRequestData smileGrade
             * @property {number|null} [supportNoun] UserPostRequestData supportNoun
             * @property {number|null} [login] UserPostRequestData login
             * @property {number|Long|null} [userId] UserPostRequestData userId
             * @property {string|null} [userName] UserPostRequestData userName
             * @property {number|null} [noUn] UserPostRequestData noUn
             * @property {string|null} [portrait] UserPostRequestData portrait
             * @property {string|null} [mobile] UserPostRequestData mobile
             * @property {string|null} [email] UserPostRequestData email
             * @property {string|null} [cookie] UserPostRequestData cookie
             * @property {number|null} [pn] UserPostRequestData pn
             * @property {tieba.ICommonRequest|null} [common] UserPostRequestData common
             * @property {number|null} [isTwzhibo] UserPostRequestData isTwzhibo
             * @property {number|null} [scrW] UserPostRequestData scrW
             * @property {number|null} [scrH] UserPostRequestData scrH
             * @property {number|null} [scrDip] UserPostRequestData scrDip
             * @property {number|null} [qType] UserPostRequestData qType
             * @property {number|null} [isViewCard] UserPostRequestData isViewCard
             * @property {number|null} [lastThreadTime] UserPostRequestData lastThreadTime
             * @property {number|null} [workTabId] UserPostRequestData workTabId
             * @property {number|null} [type] UserPostRequestData type
             * @property {number|null} [fromType] UserPostRequestData fromType
             * @property {number|Long|null} [beginThreadId] UserPostRequestData beginThreadId
             */

            /**
             * Constructs a new UserPostRequestData.
             * @memberof tieba.userPost
             * @classdesc Represents a UserPostRequestData.
             * @implements IUserPostRequestData
             * @constructor
             * @param {tieba.userPost.IUserPostRequestData=} [properties] Properties to set
             */
            function UserPostRequestData(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * UserPostRequestData uid.
             * @member {number|Long} uid
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.uid = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * UserPostRequestData rn.
             * @member {number} rn
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.rn = 0;

            /**
             * UserPostRequestData offset.
             * @member {number} offset
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.offset = 0;

            /**
             * UserPostRequestData isThread.
             * @member {number|null|undefined} isThread
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.isThread = null;

            /**
             * UserPostRequestData needContent.
             * @member {number} needContent
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.needContent = 0;

            /**
             * UserPostRequestData forumId.
             * @member {number|Long} forumId
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.forumId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            /**
             * UserPostRequestData beginTime.
             * @member {number} beginTime
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.beginTime = 0;

            /**
             * UserPostRequestData endTime.
             * @member {number} endTime
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.endTime = 0;

            /**
             * UserPostRequestData subtype.
             * @member {number|null|undefined} subtype
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.subtype = null;

            /**
             * UserPostRequestData checkLogin.
             * @member {number} checkLogin
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.checkLogin = 0;

            /**
             * UserPostRequestData ipStr.
             * @member {string} ipStr
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.ipStr = "";

            /**
             * UserPostRequestData ipInt.
             * @member {number} ipInt
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.ipInt = 0;

            /**
             * UserPostRequestData moduleName.
             * @member {string} moduleName
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.moduleName = "";

            /**
             * UserPostRequestData stType.
             * @member {number} stType
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.stType = 0;

            /**
             * UserPostRequestData stParam.
             * @member {number} stParam
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.stParam = 0;

            /**
             * UserPostRequestData smileGrade.
             * @member {number} smileGrade
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.smileGrade = 0;

            /**
             * UserPostRequestData supportNoun.
             * @member {number} supportNoun
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.supportNoun = 0;

            /**
             * UserPostRequestData login.
             * @member {number} login
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.login = 0;

            /**
             * UserPostRequestData userId.
             * @member {number|Long} userId
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.userId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

            /**
             * UserPostRequestData userName.
             * @member {string} userName
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.userName = "";

            /**
             * UserPostRequestData noUn.
             * @member {number} noUn
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.noUn = 0;

            /**
             * UserPostRequestData portrait.
             * @member {string} portrait
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.portrait = "";

            /**
             * UserPostRequestData mobile.
             * @member {string} mobile
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.mobile = "";

            /**
             * UserPostRequestData email.
             * @member {string} email
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.email = "";

            /**
             * UserPostRequestData cookie.
             * @member {string} cookie
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.cookie = "";

            /**
             * UserPostRequestData pn.
             * @member {number} pn
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.pn = 0;

            /**
             * UserPostRequestData common.
             * @member {tieba.ICommonRequest|null|undefined} common
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.common = null;

            /**
             * UserPostRequestData isTwzhibo.
             * @member {number} isTwzhibo
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.isTwzhibo = 0;

            /**
             * UserPostRequestData scrW.
             * @member {number} scrW
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.scrW = 0;

            /**
             * UserPostRequestData scrH.
             * @member {number} scrH
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.scrH = 0;

            /**
             * UserPostRequestData scrDip.
             * @member {number} scrDip
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.scrDip = 0;

            /**
             * UserPostRequestData qType.
             * @member {number} qType
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.qType = 0;

            /**
             * UserPostRequestData isViewCard.
             * @member {number|null|undefined} isViewCard
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.isViewCard = null;

            /**
             * UserPostRequestData lastThreadTime.
             * @member {number} lastThreadTime
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.lastThreadTime = 0;

            /**
             * UserPostRequestData workTabId.
             * @member {number} workTabId
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.workTabId = 0;

            /**
             * UserPostRequestData type.
             * @member {number} type
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.type = 0;

            /**
             * UserPostRequestData fromType.
             * @member {number} fromType
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.fromType = 0;

            /**
             * UserPostRequestData beginThreadId.
             * @member {number|Long} beginThreadId
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             */
            UserPostRequestData.prototype.beginThreadId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            // Virtual OneOf for proto3 optional field
            Object.defineProperty(UserPostRequestData.prototype, "_isThread", {
                get: $util.oneOfGetter($oneOfFields = ["isThread"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            // Virtual OneOf for proto3 optional field
            Object.defineProperty(UserPostRequestData.prototype, "_subtype", {
                get: $util.oneOfGetter($oneOfFields = ["subtype"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            // Virtual OneOf for proto3 optional field
            Object.defineProperty(UserPostRequestData.prototype, "_isViewCard", {
                get: $util.oneOfGetter($oneOfFields = ["isViewCard"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new UserPostRequestData instance using the specified properties.
             * @function create
             * @memberof tieba.userPost.UserPostRequestData
             * @static
             * @param {tieba.userPost.IUserPostRequestData=} [properties] Properties to set
             * @returns {tieba.userPost.UserPostRequestData} UserPostRequestData instance
             */
            UserPostRequestData.create = function create(properties) {
                return new UserPostRequestData(properties);
            };

            /**
             * Encodes the specified UserPostRequestData message. Does not implicitly {@link tieba.userPost.UserPostRequestData.verify|verify} messages.
             * @function encode
             * @memberof tieba.userPost.UserPostRequestData
             * @static
             * @param {tieba.userPost.IUserPostRequestData} message UserPostRequestData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UserPostRequestData.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.uid != null && Object.hasOwnProperty.call(message, "uid"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int64(message.uid);
                if (message.rn != null && Object.hasOwnProperty.call(message, "rn"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.rn);
                if (message.offset != null && Object.hasOwnProperty.call(message, "offset"))
                    writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.offset);
                if (message.isThread != null && Object.hasOwnProperty.call(message, "isThread"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.isThread);
                if (message.needContent != null && Object.hasOwnProperty.call(message, "needContent"))
                    writer.uint32(/* id 5, wireType 0 =*/40).uint32(message.needContent);
                if (message.forumId != null && Object.hasOwnProperty.call(message, "forumId"))
                    writer.uint32(/* id 6, wireType 0 =*/48).uint64(message.forumId);
                if (message.beginTime != null && Object.hasOwnProperty.call(message, "beginTime"))
                    writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.beginTime);
                if (message.endTime != null && Object.hasOwnProperty.call(message, "endTime"))
                    writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.endTime);
                if (message.subtype != null && Object.hasOwnProperty.call(message, "subtype"))
                    writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.subtype);
                if (message.checkLogin != null && Object.hasOwnProperty.call(message, "checkLogin"))
                    writer.uint32(/* id 10, wireType 0 =*/80).uint32(message.checkLogin);
                if (message.ipStr != null && Object.hasOwnProperty.call(message, "ipStr"))
                    writer.uint32(/* id 11, wireType 2 =*/90).string(message.ipStr);
                if (message.ipInt != null && Object.hasOwnProperty.call(message, "ipInt"))
                    writer.uint32(/* id 12, wireType 0 =*/96).uint32(message.ipInt);
                if (message.moduleName != null && Object.hasOwnProperty.call(message, "moduleName"))
                    writer.uint32(/* id 13, wireType 2 =*/106).string(message.moduleName);
                if (message.stType != null && Object.hasOwnProperty.call(message, "stType"))
                    writer.uint32(/* id 14, wireType 0 =*/112).uint32(message.stType);
                if (message.stParam != null && Object.hasOwnProperty.call(message, "stParam"))
                    writer.uint32(/* id 15, wireType 0 =*/120).uint32(message.stParam);
                if (message.smileGrade != null && Object.hasOwnProperty.call(message, "smileGrade"))
                    writer.uint32(/* id 16, wireType 0 =*/128).uint32(message.smileGrade);
                if (message.supportNoun != null && Object.hasOwnProperty.call(message, "supportNoun"))
                    writer.uint32(/* id 17, wireType 0 =*/136).uint32(message.supportNoun);
                if (message.login != null && Object.hasOwnProperty.call(message, "login"))
                    writer.uint32(/* id 18, wireType 0 =*/144).uint32(message.login);
                if (message.userId != null && Object.hasOwnProperty.call(message, "userId"))
                    writer.uint32(/* id 19, wireType 0 =*/152).int64(message.userId);
                if (message.userName != null && Object.hasOwnProperty.call(message, "userName"))
                    writer.uint32(/* id 20, wireType 2 =*/162).string(message.userName);
                if (message.noUn != null && Object.hasOwnProperty.call(message, "noUn"))
                    writer.uint32(/* id 21, wireType 0 =*/168).uint32(message.noUn);
                if (message.portrait != null && Object.hasOwnProperty.call(message, "portrait"))
                    writer.uint32(/* id 22, wireType 2 =*/178).string(message.portrait);
                if (message.mobile != null && Object.hasOwnProperty.call(message, "mobile"))
                    writer.uint32(/* id 23, wireType 2 =*/186).string(message.mobile);
                if (message.email != null && Object.hasOwnProperty.call(message, "email"))
                    writer.uint32(/* id 24, wireType 2 =*/194).string(message.email);
                if (message.cookie != null && Object.hasOwnProperty.call(message, "cookie"))
                    writer.uint32(/* id 25, wireType 2 =*/202).string(message.cookie);
                if (message.pn != null && Object.hasOwnProperty.call(message, "pn"))
                    writer.uint32(/* id 26, wireType 0 =*/208).uint32(message.pn);
                if (message.common != null && Object.hasOwnProperty.call(message, "common"))
                    $root.tieba.CommonRequest.encode(message.common, writer.uint32(/* id 27, wireType 2 =*/218).fork()).ldelim();
                if (message.isTwzhibo != null && Object.hasOwnProperty.call(message, "isTwzhibo"))
                    writer.uint32(/* id 28, wireType 0 =*/224).uint32(message.isTwzhibo);
                if (message.scrW != null && Object.hasOwnProperty.call(message, "scrW"))
                    writer.uint32(/* id 29, wireType 0 =*/232).int32(message.scrW);
                if (message.scrH != null && Object.hasOwnProperty.call(message, "scrH"))
                    writer.uint32(/* id 30, wireType 0 =*/240).int32(message.scrH);
                if (message.scrDip != null && Object.hasOwnProperty.call(message, "scrDip"))
                    writer.uint32(/* id 31, wireType 1 =*/249).double(message.scrDip);
                if (message.qType != null && Object.hasOwnProperty.call(message, "qType"))
                    writer.uint32(/* id 32, wireType 0 =*/256).int32(message.qType);
                if (message.isViewCard != null && Object.hasOwnProperty.call(message, "isViewCard"))
                    writer.uint32(/* id 33, wireType 0 =*/264).int32(message.isViewCard);
                if (message.lastThreadTime != null && Object.hasOwnProperty.call(message, "lastThreadTime"))
                    writer.uint32(/* id 34, wireType 0 =*/272).uint32(message.lastThreadTime);
                if (message.workTabId != null && Object.hasOwnProperty.call(message, "workTabId"))
                    writer.uint32(/* id 35, wireType 0 =*/280).uint32(message.workTabId);
                if (message.type != null && Object.hasOwnProperty.call(message, "type"))
                    writer.uint32(/* id 36, wireType 0 =*/288).uint32(message.type);
                if (message.fromType != null && Object.hasOwnProperty.call(message, "fromType"))
                    writer.uint32(/* id 37, wireType 0 =*/296).uint32(message.fromType);
                if (message.beginThreadId != null && Object.hasOwnProperty.call(message, "beginThreadId"))
                    writer.uint32(/* id 38, wireType 0 =*/304).uint64(message.beginThreadId);
                return writer;
            };

            /**
             * Encodes the specified UserPostRequestData message, length delimited. Does not implicitly {@link tieba.userPost.UserPostRequestData.verify|verify} messages.
             * @function encodeDelimited
             * @memberof tieba.userPost.UserPostRequestData
             * @static
             * @param {tieba.userPost.IUserPostRequestData} message UserPostRequestData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            UserPostRequestData.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a UserPostRequestData message from the specified reader or buffer.
             * @function decode
             * @memberof tieba.userPost.UserPostRequestData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {tieba.userPost.UserPostRequestData} UserPostRequestData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UserPostRequestData.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.tieba.userPost.UserPostRequestData();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.uid = reader.int64();
                            break;
                        }
                    case 2: {
                            message.rn = reader.uint32();
                            break;
                        }
                    case 3: {
                            message.offset = reader.uint32();
                            break;
                        }
                    case 4: {
                            message.isThread = reader.uint32();
                            break;
                        }
                    case 5: {
                            message.needContent = reader.uint32();
                            break;
                        }
                    case 6: {
                            message.forumId = reader.uint64();
                            break;
                        }
                    case 7: {
                            message.beginTime = reader.uint32();
                            break;
                        }
                    case 8: {
                            message.endTime = reader.uint32();
                            break;
                        }
                    case 9: {
                            message.subtype = reader.uint32();
                            break;
                        }
                    case 10: {
                            message.checkLogin = reader.uint32();
                            break;
                        }
                    case 11: {
                            message.ipStr = reader.string();
                            break;
                        }
                    case 12: {
                            message.ipInt = reader.uint32();
                            break;
                        }
                    case 13: {
                            message.moduleName = reader.string();
                            break;
                        }
                    case 14: {
                            message.stType = reader.uint32();
                            break;
                        }
                    case 15: {
                            message.stParam = reader.uint32();
                            break;
                        }
                    case 16: {
                            message.smileGrade = reader.uint32();
                            break;
                        }
                    case 17: {
                            message.supportNoun = reader.uint32();
                            break;
                        }
                    case 18: {
                            message.login = reader.uint32();
                            break;
                        }
                    case 19: {
                            message.userId = reader.int64();
                            break;
                        }
                    case 20: {
                            message.userName = reader.string();
                            break;
                        }
                    case 21: {
                            message.noUn = reader.uint32();
                            break;
                        }
                    case 22: {
                            message.portrait = reader.string();
                            break;
                        }
                    case 23: {
                            message.mobile = reader.string();
                            break;
                        }
                    case 24: {
                            message.email = reader.string();
                            break;
                        }
                    case 25: {
                            message.cookie = reader.string();
                            break;
                        }
                    case 26: {
                            message.pn = reader.uint32();
                            break;
                        }
                    case 27: {
                            message.common = $root.tieba.CommonRequest.decode(reader, reader.uint32());
                            break;
                        }
                    case 28: {
                            message.isTwzhibo = reader.uint32();
                            break;
                        }
                    case 29: {
                            message.scrW = reader.int32();
                            break;
                        }
                    case 30: {
                            message.scrH = reader.int32();
                            break;
                        }
                    case 31: {
                            message.scrDip = reader.double();
                            break;
                        }
                    case 32: {
                            message.qType = reader.int32();
                            break;
                        }
                    case 33: {
                            message.isViewCard = reader.int32();
                            break;
                        }
                    case 34: {
                            message.lastThreadTime = reader.uint32();
                            break;
                        }
                    case 35: {
                            message.workTabId = reader.uint32();
                            break;
                        }
                    case 36: {
                            message.type = reader.uint32();
                            break;
                        }
                    case 37: {
                            message.fromType = reader.uint32();
                            break;
                        }
                    case 38: {
                            message.beginThreadId = reader.uint64();
                            break;
                        }
                    default:
                        reader.skipType(tag & 7);
                        break;
                    }
                }
                return message;
            };

            /**
             * Decodes a UserPostRequestData message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof tieba.userPost.UserPostRequestData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {tieba.userPost.UserPostRequestData} UserPostRequestData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            UserPostRequestData.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a UserPostRequestData message.
             * @function verify
             * @memberof tieba.userPost.UserPostRequestData
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            UserPostRequestData.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.uid != null && message.hasOwnProperty("uid"))
                    if (!$util.isInteger(message.uid) && !(message.uid && $util.isInteger(message.uid.low) && $util.isInteger(message.uid.high)))
                        return "uid: integer|Long expected";
                if (message.rn != null && message.hasOwnProperty("rn"))
                    if (!$util.isInteger(message.rn))
                        return "rn: integer expected";
                if (message.offset != null && message.hasOwnProperty("offset"))
                    if (!$util.isInteger(message.offset))
                        return "offset: integer expected";
                if (message.isThread != null && message.hasOwnProperty("isThread")) {
                    properties._isThread = 1;
                    if (!$util.isInteger(message.isThread))
                        return "isThread: integer expected";
                }
                if (message.needContent != null && message.hasOwnProperty("needContent"))
                    if (!$util.isInteger(message.needContent))
                        return "needContent: integer expected";
                if (message.forumId != null && message.hasOwnProperty("forumId"))
                    if (!$util.isInteger(message.forumId) && !(message.forumId && $util.isInteger(message.forumId.low) && $util.isInteger(message.forumId.high)))
                        return "forumId: integer|Long expected";
                if (message.beginTime != null && message.hasOwnProperty("beginTime"))
                    if (!$util.isInteger(message.beginTime))
                        return "beginTime: integer expected";
                if (message.endTime != null && message.hasOwnProperty("endTime"))
                    if (!$util.isInteger(message.endTime))
                        return "endTime: integer expected";
                if (message.subtype != null && message.hasOwnProperty("subtype")) {
                    properties._subtype = 1;
                    if (!$util.isInteger(message.subtype))
                        return "subtype: integer expected";
                }
                if (message.checkLogin != null && message.hasOwnProperty("checkLogin"))
                    if (!$util.isInteger(message.checkLogin))
                        return "checkLogin: integer expected";
                if (message.ipStr != null && message.hasOwnProperty("ipStr"))
                    if (!$util.isString(message.ipStr))
                        return "ipStr: string expected";
                if (message.ipInt != null && message.hasOwnProperty("ipInt"))
                    if (!$util.isInteger(message.ipInt))
                        return "ipInt: integer expected";
                if (message.moduleName != null && message.hasOwnProperty("moduleName"))
                    if (!$util.isString(message.moduleName))
                        return "moduleName: string expected";
                if (message.stType != null && message.hasOwnProperty("stType"))
                    if (!$util.isInteger(message.stType))
                        return "stType: integer expected";
                if (message.stParam != null && message.hasOwnProperty("stParam"))
                    if (!$util.isInteger(message.stParam))
                        return "stParam: integer expected";
                if (message.smileGrade != null && message.hasOwnProperty("smileGrade"))
                    if (!$util.isInteger(message.smileGrade))
                        return "smileGrade: integer expected";
                if (message.supportNoun != null && message.hasOwnProperty("supportNoun"))
                    if (!$util.isInteger(message.supportNoun))
                        return "supportNoun: integer expected";
                if (message.login != null && message.hasOwnProperty("login"))
                    if (!$util.isInteger(message.login))
                        return "login: integer expected";
                if (message.userId != null && message.hasOwnProperty("userId"))
                    if (!$util.isInteger(message.userId) && !(message.userId && $util.isInteger(message.userId.low) && $util.isInteger(message.userId.high)))
                        return "userId: integer|Long expected";
                if (message.userName != null && message.hasOwnProperty("userName"))
                    if (!$util.isString(message.userName))
                        return "userName: string expected";
                if (message.noUn != null && message.hasOwnProperty("noUn"))
                    if (!$util.isInteger(message.noUn))
                        return "noUn: integer expected";
                if (message.portrait != null && message.hasOwnProperty("portrait"))
                    if (!$util.isString(message.portrait))
                        return "portrait: string expected";
                if (message.mobile != null && message.hasOwnProperty("mobile"))
                    if (!$util.isString(message.mobile))
                        return "mobile: string expected";
                if (message.email != null && message.hasOwnProperty("email"))
                    if (!$util.isString(message.email))
                        return "email: string expected";
                if (message.cookie != null && message.hasOwnProperty("cookie"))
                    if (!$util.isString(message.cookie))
                        return "cookie: string expected";
                if (message.pn != null && message.hasOwnProperty("pn"))
                    if (!$util.isInteger(message.pn))
                        return "pn: integer expected";
                if (message.common != null && message.hasOwnProperty("common")) {
                    let error = $root.tieba.CommonRequest.verify(message.common);
                    if (error)
                        return "common." + error;
                }
                if (message.isTwzhibo != null && message.hasOwnProperty("isTwzhibo"))
                    if (!$util.isInteger(message.isTwzhibo))
                        return "isTwzhibo: integer expected";
                if (message.scrW != null && message.hasOwnProperty("scrW"))
                    if (!$util.isInteger(message.scrW))
                        return "scrW: integer expected";
                if (message.scrH != null && message.hasOwnProperty("scrH"))
                    if (!$util.isInteger(message.scrH))
                        return "scrH: integer expected";
                if (message.scrDip != null && message.hasOwnProperty("scrDip"))
                    if (typeof message.scrDip !== "number")
                        return "scrDip: number expected";
                if (message.qType != null && message.hasOwnProperty("qType"))
                    if (!$util.isInteger(message.qType))
                        return "qType: integer expected";
                if (message.isViewCard != null && message.hasOwnProperty("isViewCard")) {
                    properties._isViewCard = 1;
                    if (!$util.isInteger(message.isViewCard))
                        return "isViewCard: integer expected";
                }
                if (message.lastThreadTime != null && message.hasOwnProperty("lastThreadTime"))
                    if (!$util.isInteger(message.lastThreadTime))
                        return "lastThreadTime: integer expected";
                if (message.workTabId != null && message.hasOwnProperty("workTabId"))
                    if (!$util.isInteger(message.workTabId))
                        return "workTabId: integer expected";
                if (message.type != null && message.hasOwnProperty("type"))
                    if (!$util.isInteger(message.type))
                        return "type: integer expected";
                if (message.fromType != null && message.hasOwnProperty("fromType"))
                    if (!$util.isInteger(message.fromType))
                        return "fromType: integer expected";
                if (message.beginThreadId != null && message.hasOwnProperty("beginThreadId"))
                    if (!$util.isInteger(message.beginThreadId) && !(message.beginThreadId && $util.isInteger(message.beginThreadId.low) && $util.isInteger(message.beginThreadId.high)))
                        return "beginThreadId: integer|Long expected";
                return null;
            };

            /**
             * Creates a UserPostRequestData message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof tieba.userPost.UserPostRequestData
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {tieba.userPost.UserPostRequestData} UserPostRequestData
             */
            UserPostRequestData.fromObject = function fromObject(object) {
                if (object instanceof $root.tieba.userPost.UserPostRequestData)
                    return object;
                let message = new $root.tieba.userPost.UserPostRequestData();
                if (object.uid != null)
                    if ($util.Long)
                        (message.uid = $util.Long.fromValue(object.uid)).unsigned = false;
                    else if (typeof object.uid === "string")
                        message.uid = parseInt(object.uid, 10);
                    else if (typeof object.uid === "number")
                        message.uid = object.uid;
                    else if (typeof object.uid === "object")
                        message.uid = new $util.LongBits(object.uid.low >>> 0, object.uid.high >>> 0).toNumber();
                if (object.rn != null)
                    message.rn = object.rn >>> 0;
                if (object.offset != null)
                    message.offset = object.offset >>> 0;
                if (object.isThread != null)
                    message.isThread = object.isThread >>> 0;
                if (object.needContent != null)
                    message.needContent = object.needContent >>> 0;
                if (object.forumId != null)
                    if ($util.Long)
                        (message.forumId = $util.Long.fromValue(object.forumId)).unsigned = true;
                    else if (typeof object.forumId === "string")
                        message.forumId = parseInt(object.forumId, 10);
                    else if (typeof object.forumId === "number")
                        message.forumId = object.forumId;
                    else if (typeof object.forumId === "object")
                        message.forumId = new $util.LongBits(object.forumId.low >>> 0, object.forumId.high >>> 0).toNumber(true);
                if (object.beginTime != null)
                    message.beginTime = object.beginTime >>> 0;
                if (object.endTime != null)
                    message.endTime = object.endTime >>> 0;
                if (object.subtype != null)
                    message.subtype = object.subtype >>> 0;
                if (object.checkLogin != null)
                    message.checkLogin = object.checkLogin >>> 0;
                if (object.ipStr != null)
                    message.ipStr = String(object.ipStr);
                if (object.ipInt != null)
                    message.ipInt = object.ipInt >>> 0;
                if (object.moduleName != null)
                    message.moduleName = String(object.moduleName);
                if (object.stType != null)
                    message.stType = object.stType >>> 0;
                if (object.stParam != null)
                    message.stParam = object.stParam >>> 0;
                if (object.smileGrade != null)
                    message.smileGrade = object.smileGrade >>> 0;
                if (object.supportNoun != null)
                    message.supportNoun = object.supportNoun >>> 0;
                if (object.login != null)
                    message.login = object.login >>> 0;
                if (object.userId != null)
                    if ($util.Long)
                        (message.userId = $util.Long.fromValue(object.userId)).unsigned = false;
                    else if (typeof object.userId === "string")
                        message.userId = parseInt(object.userId, 10);
                    else if (typeof object.userId === "number")
                        message.userId = object.userId;
                    else if (typeof object.userId === "object")
                        message.userId = new $util.LongBits(object.userId.low >>> 0, object.userId.high >>> 0).toNumber();
                if (object.userName != null)
                    message.userName = String(object.userName);
                if (object.noUn != null)
                    message.noUn = object.noUn >>> 0;
                if (object.portrait != null)
                    message.portrait = String(object.portrait);
                if (object.mobile != null)
                    message.mobile = String(object.mobile);
                if (object.email != null)
                    message.email = String(object.email);
                if (object.cookie != null)
                    message.cookie = String(object.cookie);
                if (object.pn != null)
                    message.pn = object.pn >>> 0;
                if (object.common != null) {
                    if (typeof object.common !== "object")
                        throw TypeError(".tieba.userPost.UserPostRequestData.common: object expected");
                    message.common = $root.tieba.CommonRequest.fromObject(object.common);
                }
                if (object.isTwzhibo != null)
                    message.isTwzhibo = object.isTwzhibo >>> 0;
                if (object.scrW != null)
                    message.scrW = object.scrW | 0;
                if (object.scrH != null)
                    message.scrH = object.scrH | 0;
                if (object.scrDip != null)
                    message.scrDip = Number(object.scrDip);
                if (object.qType != null)
                    message.qType = object.qType | 0;
                if (object.isViewCard != null)
                    message.isViewCard = object.isViewCard | 0;
                if (object.lastThreadTime != null)
                    message.lastThreadTime = object.lastThreadTime >>> 0;
                if (object.workTabId != null)
                    message.workTabId = object.workTabId >>> 0;
                if (object.type != null)
                    message.type = object.type >>> 0;
                if (object.fromType != null)
                    message.fromType = object.fromType >>> 0;
                if (object.beginThreadId != null)
                    if ($util.Long)
                        (message.beginThreadId = $util.Long.fromValue(object.beginThreadId)).unsigned = true;
                    else if (typeof object.beginThreadId === "string")
                        message.beginThreadId = parseInt(object.beginThreadId, 10);
                    else if (typeof object.beginThreadId === "number")
                        message.beginThreadId = object.beginThreadId;
                    else if (typeof object.beginThreadId === "object")
                        message.beginThreadId = new $util.LongBits(object.beginThreadId.low >>> 0, object.beginThreadId.high >>> 0).toNumber(true);
                return message;
            };

            /**
             * Creates a plain object from a UserPostRequestData message. Also converts values to other types if specified.
             * @function toObject
             * @memberof tieba.userPost.UserPostRequestData
             * @static
             * @param {tieba.userPost.UserPostRequestData} message UserPostRequestData
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            UserPostRequestData.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, false);
                        object.uid = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.uid = options.longs === String ? "0" : 0;
                    object.rn = 0;
                    object.offset = 0;
                    object.needContent = 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.forumId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.forumId = options.longs === String ? "0" : 0;
                    object.beginTime = 0;
                    object.endTime = 0;
                    object.checkLogin = 0;
                    object.ipStr = "";
                    object.ipInt = 0;
                    object.moduleName = "";
                    object.stType = 0;
                    object.stParam = 0;
                    object.smileGrade = 0;
                    object.supportNoun = 0;
                    object.login = 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, false);
                        object.userId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.userId = options.longs === String ? "0" : 0;
                    object.userName = "";
                    object.noUn = 0;
                    object.portrait = "";
                    object.mobile = "";
                    object.email = "";
                    object.cookie = "";
                    object.pn = 0;
                    object.common = null;
                    object.isTwzhibo = 0;
                    object.scrW = 0;
                    object.scrH = 0;
                    object.scrDip = 0;
                    object.qType = 0;
                    object.lastThreadTime = 0;
                    object.workTabId = 0;
                    object.type = 0;
                    object.fromType = 0;
                    if ($util.Long) {
                        let long = new $util.Long(0, 0, true);
                        object.beginThreadId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                    } else
                        object.beginThreadId = options.longs === String ? "0" : 0;
                }
                if (message.uid != null && message.hasOwnProperty("uid"))
                    if (typeof message.uid === "number")
                        object.uid = options.longs === String ? String(message.uid) : message.uid;
                    else
                        object.uid = options.longs === String ? $util.Long.prototype.toString.call(message.uid) : options.longs === Number ? new $util.LongBits(message.uid.low >>> 0, message.uid.high >>> 0).toNumber() : message.uid;
                if (message.rn != null && message.hasOwnProperty("rn"))
                    object.rn = message.rn;
                if (message.offset != null && message.hasOwnProperty("offset"))
                    object.offset = message.offset;
                if (message.isThread != null && message.hasOwnProperty("isThread")) {
                    object.isThread = message.isThread;
                    if (options.oneofs)
                        object._isThread = "isThread";
                }
                if (message.needContent != null && message.hasOwnProperty("needContent"))
                    object.needContent = message.needContent;
                if (message.forumId != null && message.hasOwnProperty("forumId"))
                    if (typeof message.forumId === "number")
                        object.forumId = options.longs === String ? String(message.forumId) : message.forumId;
                    else
                        object.forumId = options.longs === String ? $util.Long.prototype.toString.call(message.forumId) : options.longs === Number ? new $util.LongBits(message.forumId.low >>> 0, message.forumId.high >>> 0).toNumber(true) : message.forumId;
                if (message.beginTime != null && message.hasOwnProperty("beginTime"))
                    object.beginTime = message.beginTime;
                if (message.endTime != null && message.hasOwnProperty("endTime"))
                    object.endTime = message.endTime;
                if (message.subtype != null && message.hasOwnProperty("subtype")) {
                    object.subtype = message.subtype;
                    if (options.oneofs)
                        object._subtype = "subtype";
                }
                if (message.checkLogin != null && message.hasOwnProperty("checkLogin"))
                    object.checkLogin = message.checkLogin;
                if (message.ipStr != null && message.hasOwnProperty("ipStr"))
                    object.ipStr = message.ipStr;
                if (message.ipInt != null && message.hasOwnProperty("ipInt"))
                    object.ipInt = message.ipInt;
                if (message.moduleName != null && message.hasOwnProperty("moduleName"))
                    object.moduleName = message.moduleName;
                if (message.stType != null && message.hasOwnProperty("stType"))
                    object.stType = message.stType;
                if (message.stParam != null && message.hasOwnProperty("stParam"))
                    object.stParam = message.stParam;
                if (message.smileGrade != null && message.hasOwnProperty("smileGrade"))
                    object.smileGrade = message.smileGrade;
                if (message.supportNoun != null && message.hasOwnProperty("supportNoun"))
                    object.supportNoun = message.supportNoun;
                if (message.login != null && message.hasOwnProperty("login"))
                    object.login = message.login;
                if (message.userId != null && message.hasOwnProperty("userId"))
                    if (typeof message.userId === "number")
                        object.userId = options.longs === String ? String(message.userId) : message.userId;
                    else
                        object.userId = options.longs === String ? $util.Long.prototype.toString.call(message.userId) : options.longs === Number ? new $util.LongBits(message.userId.low >>> 0, message.userId.high >>> 0).toNumber() : message.userId;
                if (message.userName != null && message.hasOwnProperty("userName"))
                    object.userName = message.userName;
                if (message.noUn != null && message.hasOwnProperty("noUn"))
                    object.noUn = message.noUn;
                if (message.portrait != null && message.hasOwnProperty("portrait"))
                    object.portrait = message.portrait;
                if (message.mobile != null && message.hasOwnProperty("mobile"))
                    object.mobile = message.mobile;
                if (message.email != null && message.hasOwnProperty("email"))
                    object.email = message.email;
                if (message.cookie != null && message.hasOwnProperty("cookie"))
                    object.cookie = message.cookie;
                if (message.pn != null && message.hasOwnProperty("pn"))
                    object.pn = message.pn;
                if (message.common != null && message.hasOwnProperty("common"))
                    object.common = $root.tieba.CommonRequest.toObject(message.common, options);
                if (message.isTwzhibo != null && message.hasOwnProperty("isTwzhibo"))
                    object.isTwzhibo = message.isTwzhibo;
                if (message.scrW != null && message.hasOwnProperty("scrW"))
                    object.scrW = message.scrW;
                if (message.scrH != null && message.hasOwnProperty("scrH"))
                    object.scrH = message.scrH;
                if (message.scrDip != null && message.hasOwnProperty("scrDip"))
                    object.scrDip = options.json && !isFinite(message.scrDip) ? String(message.scrDip) : message.scrDip;
                if (message.qType != null && message.hasOwnProperty("qType"))
                    object.qType = message.qType;
                if (message.isViewCard != null && message.hasOwnProperty("isViewCard")) {
                    object.isViewCard = message.isViewCard;
                    if (options.oneofs)
                        object._isViewCard = "isViewCard";
                }
                if (message.lastThreadTime != null && message.hasOwnProperty("lastThreadTime"))
                    object.lastThreadTime = message.lastThreadTime;
                if (message.workTabId != null && message.hasOwnProperty("workTabId"))
                    object.workTabId = message.workTabId;
                if (message.type != null && message.hasOwnProperty("type"))
                    object.type = message.type;
                if (message.fromType != null && message.hasOwnProperty("fromType"))
                    object.fromType = message.fromType;
                if (message.beginThreadId != null && message.hasOwnProperty("beginThreadId"))
                    if (typeof message.beginThreadId === "number")
                        object.beginThreadId = options.longs === String ? String(message.beginThreadId) : message.beginThreadId;
                    else
                        object.beginThreadId = options.longs === String ? $util.Long.prototype.toString.call(message.beginThreadId) : options.longs === Number ? new $util.LongBits(message.beginThreadId.low >>> 0, message.beginThreadId.high >>> 0).toNumber(true) : message.beginThreadId;
                return object;
            };

            /**
             * Converts this UserPostRequestData to JSON.
             * @function toJSON
             * @memberof tieba.userPost.UserPostRequestData
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            UserPostRequestData.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for UserPostRequestData
             * @function getTypeUrl
             * @memberof tieba.userPost.UserPostRequestData
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            UserPostRequestData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/tieba.userPost.UserPostRequestData";
            };

            return UserPostRequestData;
        })();

        return userPost;
    })();

    tieba.CommonRequest = (function() {

        /**
         * Properties of a CommonRequest.
         * @memberof tieba
         * @interface ICommonRequest
         * @property {number|null} [_clientType] CommonRequest _clientType
         * @property {string|null} [_clientVersion] CommonRequest _clientVersion
         * @property {string|null} [_clientId] CommonRequest _clientId
         * @property {string|null} [_phoneImei] CommonRequest _phoneImei
         * @property {string|null} [from] CommonRequest from
         * @property {string|null} [cuid] CommonRequest cuid
         * @property {number|Long|null} [_timestamp] CommonRequest _timestamp
         * @property {string|null} [model] CommonRequest model
         * @property {string|null} [BDUSS] CommonRequest BDUSS
         * @property {string|null} [tbs] CommonRequest tbs
         * @property {number|null} [netType] CommonRequest netType
         * @property {string|null} [_phoneNewimei] CommonRequest _phoneNewimei
         * @property {string|null} [sign] CommonRequest sign
         * @property {string|null} [pversion] CommonRequest pversion
         * @property {string|null} [_osVersion] CommonRequest _osVersion
         * @property {string|null} [brand] CommonRequest brand
         * @property {string|null} [legoLibVersion] CommonRequest legoLibVersion
         * @property {string|null} [applist] CommonRequest applist
         * @property {string|null} [stoken] CommonRequest stoken
         * @property {string|null} [zId] CommonRequest zId
         * @property {string|null} [cuidGalaxy2] CommonRequest cuidGalaxy2
         * @property {string|null} [cuidGid] CommonRequest cuidGid
         * @property {string|null} [oaid] CommonRequest oaid
         * @property {string|null} [c3Aid] CommonRequest c3Aid
         * @property {string|null} [sampleId] CommonRequest sampleId
         * @property {number|null} [scrW] CommonRequest scrW
         * @property {number|null} [scrH] CommonRequest scrH
         * @property {number|null} [scrDip] CommonRequest scrDip
         * @property {number|null} [qType] CommonRequest qType
         * @property {number|null} [isTeenager] CommonRequest isTeenager
         * @property {string|null} [sdkVer] CommonRequest sdkVer
         * @property {string|null} [frameworkVer] CommonRequest frameworkVer
         * @property {string|null} [swanGameVer] CommonRequest swanGameVer
         * @property {number|Long|null} [activeTimestamp] CommonRequest activeTimestamp
         * @property {number|Long|null} [firstInstallTime] CommonRequest firstInstallTime
         * @property {number|Long|null} [lastUpdateTime] CommonRequest lastUpdateTime
         * @property {string|null} [eventDay] CommonRequest eventDay
         * @property {string|null} [androidId] CommonRequest androidId
         * @property {number|null} [cmode] CommonRequest cmode
         * @property {string|null} [startScheme] CommonRequest startScheme
         * @property {number|null} [startType] CommonRequest startType
         * @property {string|null} [extra] CommonRequest extra
         * @property {string|null} [userAgent] CommonRequest userAgent
         * @property {number|null} [personalizedRecSwitch] CommonRequest personalizedRecSwitch
         * @property {string|null} [deviceScore] CommonRequest deviceScore
         */

        /**
         * Constructs a new CommonRequest.
         * @memberof tieba
         * @classdesc Represents a CommonRequest.
         * @implements ICommonRequest
         * @constructor
         * @param {tieba.ICommonRequest=} [properties] Properties to set
         */
        function CommonRequest(properties) {
            if (properties)
                for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * CommonRequest _clientType.
         * @member {number} _clientType
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype._clientType = 0;

        /**
         * CommonRequest _clientVersion.
         * @member {string} _clientVersion
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype._clientVersion = "";

        /**
         * CommonRequest _clientId.
         * @member {string} _clientId
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype._clientId = "";

        /**
         * CommonRequest _phoneImei.
         * @member {string} _phoneImei
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype._phoneImei = "";

        /**
         * CommonRequest from.
         * @member {string} from
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.from = "";

        /**
         * CommonRequest cuid.
         * @member {string} cuid
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.cuid = "";

        /**
         * CommonRequest _timestamp.
         * @member {number|Long} _timestamp
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype._timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * CommonRequest model.
         * @member {string} model
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.model = "";

        /**
         * CommonRequest BDUSS.
         * @member {string|null|undefined} BDUSS
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.BDUSS = null;

        /**
         * CommonRequest tbs.
         * @member {string|null|undefined} tbs
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.tbs = null;

        /**
         * CommonRequest netType.
         * @member {number} netType
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.netType = 0;

        /**
         * CommonRequest _phoneNewimei.
         * @member {string} _phoneNewimei
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype._phoneNewimei = "";

        /**
         * CommonRequest sign.
         * @member {string|null|undefined} sign
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.sign = null;

        /**
         * CommonRequest pversion.
         * @member {string} pversion
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.pversion = "";

        /**
         * CommonRequest _osVersion.
         * @member {string} _osVersion
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype._osVersion = "";

        /**
         * CommonRequest brand.
         * @member {string} brand
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.brand = "";

        /**
         * CommonRequest legoLibVersion.
         * @member {string} legoLibVersion
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.legoLibVersion = "";

        /**
         * CommonRequest applist.
         * @member {string|null|undefined} applist
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.applist = null;

        /**
         * CommonRequest stoken.
         * @member {string|null|undefined} stoken
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.stoken = null;

        /**
         * CommonRequest zId.
         * @member {string|null|undefined} zId
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.zId = null;

        /**
         * CommonRequest cuidGalaxy2.
         * @member {string} cuidGalaxy2
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.cuidGalaxy2 = "";

        /**
         * CommonRequest cuidGid.
         * @member {string|null|undefined} cuidGid
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.cuidGid = null;

        /**
         * CommonRequest oaid.
         * @member {string|null|undefined} oaid
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.oaid = null;

        /**
         * CommonRequest c3Aid.
         * @member {string} c3Aid
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.c3Aid = "";

        /**
         * CommonRequest sampleId.
         * @member {string|null|undefined} sampleId
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.sampleId = null;

        /**
         * CommonRequest scrW.
         * @member {number} scrW
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.scrW = 0;

        /**
         * CommonRequest scrH.
         * @member {number} scrH
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.scrH = 0;

        /**
         * CommonRequest scrDip.
         * @member {number} scrDip
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.scrDip = 0;

        /**
         * CommonRequest qType.
         * @member {number|null|undefined} qType
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.qType = null;

        /**
         * CommonRequest isTeenager.
         * @member {number|null|undefined} isTeenager
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.isTeenager = null;

        /**
         * CommonRequest sdkVer.
         * @member {string} sdkVer
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.sdkVer = "";

        /**
         * CommonRequest frameworkVer.
         * @member {string} frameworkVer
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.frameworkVer = "";

        /**
         * CommonRequest swanGameVer.
         * @member {string} swanGameVer
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.swanGameVer = "";

        /**
         * CommonRequest activeTimestamp.
         * @member {number|Long} activeTimestamp
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.activeTimestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * CommonRequest firstInstallTime.
         * @member {number|Long} firstInstallTime
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.firstInstallTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * CommonRequest lastUpdateTime.
         * @member {number|Long} lastUpdateTime
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.lastUpdateTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

        /**
         * CommonRequest eventDay.
         * @member {string} eventDay
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.eventDay = "";

        /**
         * CommonRequest androidId.
         * @member {string} androidId
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.androidId = "";

        /**
         * CommonRequest cmode.
         * @member {number} cmode
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.cmode = 0;

        /**
         * CommonRequest startScheme.
         * @member {string|null|undefined} startScheme
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.startScheme = null;

        /**
         * CommonRequest startType.
         * @member {number} startType
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.startType = 0;

        /**
         * CommonRequest extra.
         * @member {string|null|undefined} extra
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.extra = null;

        /**
         * CommonRequest userAgent.
         * @member {string} userAgent
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.userAgent = "";

        /**
         * CommonRequest personalizedRecSwitch.
         * @member {number} personalizedRecSwitch
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.personalizedRecSwitch = 0;

        /**
         * CommonRequest deviceScore.
         * @member {string} deviceScore
         * @memberof tieba.CommonRequest
         * @instance
         */
        CommonRequest.prototype.deviceScore = "";

        // OneOf field names bound to virtual getters and setters
        let $oneOfFields;

        // Virtual OneOf for proto3 optional field
        Object.defineProperty(CommonRequest.prototype, "_BDUSS", {
            get: $util.oneOfGetter($oneOfFields = ["BDUSS"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        // Virtual OneOf for proto3 optional field
        Object.defineProperty(CommonRequest.prototype, "_tbs", {
            get: $util.oneOfGetter($oneOfFields = ["tbs"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        // Virtual OneOf for proto3 optional field
        Object.defineProperty(CommonRequest.prototype, "_sign", {
            get: $util.oneOfGetter($oneOfFields = ["sign"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        // Virtual OneOf for proto3 optional field
        Object.defineProperty(CommonRequest.prototype, "_applist", {
            get: $util.oneOfGetter($oneOfFields = ["applist"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        // Virtual OneOf for proto3 optional field
        Object.defineProperty(CommonRequest.prototype, "_stoken", {
            get: $util.oneOfGetter($oneOfFields = ["stoken"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        // Virtual OneOf for proto3 optional field
        Object.defineProperty(CommonRequest.prototype, "_zId", {
            get: $util.oneOfGetter($oneOfFields = ["zId"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        // Virtual OneOf for proto3 optional field
        Object.defineProperty(CommonRequest.prototype, "_cuidGid", {
            get: $util.oneOfGetter($oneOfFields = ["cuidGid"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        // Virtual OneOf for proto3 optional field
        Object.defineProperty(CommonRequest.prototype, "_oaid", {
            get: $util.oneOfGetter($oneOfFields = ["oaid"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        // Virtual OneOf for proto3 optional field
        Object.defineProperty(CommonRequest.prototype, "_sampleId", {
            get: $util.oneOfGetter($oneOfFields = ["sampleId"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        // Virtual OneOf for proto3 optional field
        Object.defineProperty(CommonRequest.prototype, "_qType", {
            get: $util.oneOfGetter($oneOfFields = ["qType"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        // Virtual OneOf for proto3 optional field
        Object.defineProperty(CommonRequest.prototype, "_isTeenager", {
            get: $util.oneOfGetter($oneOfFields = ["isTeenager"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        // Virtual OneOf for proto3 optional field
        Object.defineProperty(CommonRequest.prototype, "_startScheme", {
            get: $util.oneOfGetter($oneOfFields = ["startScheme"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        // Virtual OneOf for proto3 optional field
        Object.defineProperty(CommonRequest.prototype, "_extra", {
            get: $util.oneOfGetter($oneOfFields = ["extra"]),
            set: $util.oneOfSetter($oneOfFields)
        });

        /**
         * Creates a new CommonRequest instance using the specified properties.
         * @function create
         * @memberof tieba.CommonRequest
         * @static
         * @param {tieba.ICommonRequest=} [properties] Properties to set
         * @returns {tieba.CommonRequest} CommonRequest instance
         */
        CommonRequest.create = function create(properties) {
            return new CommonRequest(properties);
        };

        /**
         * Encodes the specified CommonRequest message. Does not implicitly {@link tieba.CommonRequest.verify|verify} messages.
         * @function encode
         * @memberof tieba.CommonRequest
         * @static
         * @param {tieba.ICommonRequest} message CommonRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CommonRequest.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message._clientType != null && Object.hasOwnProperty.call(message, "_clientType"))
                writer.uint32(/* id 1, wireType 0 =*/8).int32(message._clientType);
            if (message._clientVersion != null && Object.hasOwnProperty.call(message, "_clientVersion"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message._clientVersion);
            if (message._clientId != null && Object.hasOwnProperty.call(message, "_clientId"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message._clientId);
            if (message._phoneImei != null && Object.hasOwnProperty.call(message, "_phoneImei"))
                writer.uint32(/* id 5, wireType 2 =*/42).string(message._phoneImei);
            if (message.from != null && Object.hasOwnProperty.call(message, "from"))
                writer.uint32(/* id 6, wireType 2 =*/50).string(message.from);
            if (message.cuid != null && Object.hasOwnProperty.call(message, "cuid"))
                writer.uint32(/* id 7, wireType 2 =*/58).string(message.cuid);
            if (message._timestamp != null && Object.hasOwnProperty.call(message, "_timestamp"))
                writer.uint32(/* id 8, wireType 0 =*/64).int64(message._timestamp);
            if (message.model != null && Object.hasOwnProperty.call(message, "model"))
                writer.uint32(/* id 9, wireType 2 =*/74).string(message.model);
            if (message.BDUSS != null && Object.hasOwnProperty.call(message, "BDUSS"))
                writer.uint32(/* id 10, wireType 2 =*/82).string(message.BDUSS);
            if (message.tbs != null && Object.hasOwnProperty.call(message, "tbs"))
                writer.uint32(/* id 11, wireType 2 =*/90).string(message.tbs);
            if (message.netType != null && Object.hasOwnProperty.call(message, "netType"))
                writer.uint32(/* id 12, wireType 0 =*/96).int32(message.netType);
            if (message._phoneNewimei != null && Object.hasOwnProperty.call(message, "_phoneNewimei"))
                writer.uint32(/* id 14, wireType 2 =*/114).string(message._phoneNewimei);
            if (message.sign != null && Object.hasOwnProperty.call(message, "sign"))
                writer.uint32(/* id 23, wireType 2 =*/186).string(message.sign);
            if (message.pversion != null && Object.hasOwnProperty.call(message, "pversion"))
                writer.uint32(/* id 24, wireType 2 =*/194).string(message.pversion);
            if (message._osVersion != null && Object.hasOwnProperty.call(message, "_osVersion"))
                writer.uint32(/* id 25, wireType 2 =*/202).string(message._osVersion);
            if (message.brand != null && Object.hasOwnProperty.call(message, "brand"))
                writer.uint32(/* id 26, wireType 2 =*/210).string(message.brand);
            if (message.legoLibVersion != null && Object.hasOwnProperty.call(message, "legoLibVersion"))
                writer.uint32(/* id 28, wireType 2 =*/226).string(message.legoLibVersion);
            if (message.applist != null && Object.hasOwnProperty.call(message, "applist"))
                writer.uint32(/* id 29, wireType 2 =*/234).string(message.applist);
            if (message.stoken != null && Object.hasOwnProperty.call(message, "stoken"))
                writer.uint32(/* id 30, wireType 2 =*/242).string(message.stoken);
            if (message.zId != null && Object.hasOwnProperty.call(message, "zId"))
                writer.uint32(/* id 31, wireType 2 =*/250).string(message.zId);
            if (message.cuidGalaxy2 != null && Object.hasOwnProperty.call(message, "cuidGalaxy2"))
                writer.uint32(/* id 32, wireType 2 =*/258).string(message.cuidGalaxy2);
            if (message.cuidGid != null && Object.hasOwnProperty.call(message, "cuidGid"))
                writer.uint32(/* id 33, wireType 2 =*/266).string(message.cuidGid);
            if (message.oaid != null && Object.hasOwnProperty.call(message, "oaid"))
                writer.uint32(/* id 34, wireType 2 =*/274).string(message.oaid);
            if (message.c3Aid != null && Object.hasOwnProperty.call(message, "c3Aid"))
                writer.uint32(/* id 35, wireType 2 =*/282).string(message.c3Aid);
            if (message.sampleId != null && Object.hasOwnProperty.call(message, "sampleId"))
                writer.uint32(/* id 36, wireType 2 =*/290).string(message.sampleId);
            if (message.scrW != null && Object.hasOwnProperty.call(message, "scrW"))
                writer.uint32(/* id 37, wireType 0 =*/296).int32(message.scrW);
            if (message.scrH != null && Object.hasOwnProperty.call(message, "scrH"))
                writer.uint32(/* id 38, wireType 0 =*/304).int32(message.scrH);
            if (message.scrDip != null && Object.hasOwnProperty.call(message, "scrDip"))
                writer.uint32(/* id 39, wireType 1 =*/313).double(message.scrDip);
            if (message.qType != null && Object.hasOwnProperty.call(message, "qType"))
                writer.uint32(/* id 40, wireType 0 =*/320).int32(message.qType);
            if (message.isTeenager != null && Object.hasOwnProperty.call(message, "isTeenager"))
                writer.uint32(/* id 41, wireType 0 =*/328).int32(message.isTeenager);
            if (message.sdkVer != null && Object.hasOwnProperty.call(message, "sdkVer"))
                writer.uint32(/* id 42, wireType 2 =*/338).string(message.sdkVer);
            if (message.frameworkVer != null && Object.hasOwnProperty.call(message, "frameworkVer"))
                writer.uint32(/* id 43, wireType 2 =*/346).string(message.frameworkVer);
            if (message.swanGameVer != null && Object.hasOwnProperty.call(message, "swanGameVer"))
                writer.uint32(/* id 44, wireType 2 =*/354).string(message.swanGameVer);
            if (message.activeTimestamp != null && Object.hasOwnProperty.call(message, "activeTimestamp"))
                writer.uint32(/* id 49, wireType 0 =*/392).int64(message.activeTimestamp);
            if (message.firstInstallTime != null && Object.hasOwnProperty.call(message, "firstInstallTime"))
                writer.uint32(/* id 50, wireType 0 =*/400).int64(message.firstInstallTime);
            if (message.lastUpdateTime != null && Object.hasOwnProperty.call(message, "lastUpdateTime"))
                writer.uint32(/* id 51, wireType 0 =*/408).int64(message.lastUpdateTime);
            if (message.eventDay != null && Object.hasOwnProperty.call(message, "eventDay"))
                writer.uint32(/* id 53, wireType 2 =*/426).string(message.eventDay);
            if (message.androidId != null && Object.hasOwnProperty.call(message, "androidId"))
                writer.uint32(/* id 54, wireType 2 =*/434).string(message.androidId);
            if (message.cmode != null && Object.hasOwnProperty.call(message, "cmode"))
                writer.uint32(/* id 55, wireType 0 =*/440).int32(message.cmode);
            if (message.startScheme != null && Object.hasOwnProperty.call(message, "startScheme"))
                writer.uint32(/* id 56, wireType 2 =*/450).string(message.startScheme);
            if (message.startType != null && Object.hasOwnProperty.call(message, "startType"))
                writer.uint32(/* id 57, wireType 0 =*/456).int32(message.startType);
            if (message.extra != null && Object.hasOwnProperty.call(message, "extra"))
                writer.uint32(/* id 61, wireType 2 =*/490).string(message.extra);
            if (message.userAgent != null && Object.hasOwnProperty.call(message, "userAgent"))
                writer.uint32(/* id 62, wireType 2 =*/498).string(message.userAgent);
            if (message.personalizedRecSwitch != null && Object.hasOwnProperty.call(message, "personalizedRecSwitch"))
                writer.uint32(/* id 63, wireType 0 =*/504).int32(message.personalizedRecSwitch);
            if (message.deviceScore != null && Object.hasOwnProperty.call(message, "deviceScore"))
                writer.uint32(/* id 70, wireType 2 =*/562).string(message.deviceScore);
            return writer;
        };

        /**
         * Encodes the specified CommonRequest message, length delimited. Does not implicitly {@link tieba.CommonRequest.verify|verify} messages.
         * @function encodeDelimited
         * @memberof tieba.CommonRequest
         * @static
         * @param {tieba.ICommonRequest} message CommonRequest message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        CommonRequest.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a CommonRequest message from the specified reader or buffer.
         * @function decode
         * @memberof tieba.CommonRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {tieba.CommonRequest} CommonRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CommonRequest.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            let end = length === undefined ? reader.len : reader.pos + length, message = new $root.tieba.CommonRequest();
            while (reader.pos < end) {
                let tag = reader.uint32();
                switch (tag >>> 3) {
                case 1: {
                        message._clientType = reader.int32();
                        break;
                    }
                case 2: {
                        message._clientVersion = reader.string();
                        break;
                    }
                case 3: {
                        message._clientId = reader.string();
                        break;
                    }
                case 5: {
                        message._phoneImei = reader.string();
                        break;
                    }
                case 6: {
                        message.from = reader.string();
                        break;
                    }
                case 7: {
                        message.cuid = reader.string();
                        break;
                    }
                case 8: {
                        message._timestamp = reader.int64();
                        break;
                    }
                case 9: {
                        message.model = reader.string();
                        break;
                    }
                case 10: {
                        message.BDUSS = reader.string();
                        break;
                    }
                case 11: {
                        message.tbs = reader.string();
                        break;
                    }
                case 12: {
                        message.netType = reader.int32();
                        break;
                    }
                case 14: {
                        message._phoneNewimei = reader.string();
                        break;
                    }
                case 23: {
                        message.sign = reader.string();
                        break;
                    }
                case 24: {
                        message.pversion = reader.string();
                        break;
                    }
                case 25: {
                        message._osVersion = reader.string();
                        break;
                    }
                case 26: {
                        message.brand = reader.string();
                        break;
                    }
                case 28: {
                        message.legoLibVersion = reader.string();
                        break;
                    }
                case 29: {
                        message.applist = reader.string();
                        break;
                    }
                case 30: {
                        message.stoken = reader.string();
                        break;
                    }
                case 31: {
                        message.zId = reader.string();
                        break;
                    }
                case 32: {
                        message.cuidGalaxy2 = reader.string();
                        break;
                    }
                case 33: {
                        message.cuidGid = reader.string();
                        break;
                    }
                case 34: {
                        message.oaid = reader.string();
                        break;
                    }
                case 35: {
                        message.c3Aid = reader.string();
                        break;
                    }
                case 36: {
                        message.sampleId = reader.string();
                        break;
                    }
                case 37: {
                        message.scrW = reader.int32();
                        break;
                    }
                case 38: {
                        message.scrH = reader.int32();
                        break;
                    }
                case 39: {
                        message.scrDip = reader.double();
                        break;
                    }
                case 40: {
                        message.qType = reader.int32();
                        break;
                    }
                case 41: {
                        message.isTeenager = reader.int32();
                        break;
                    }
                case 42: {
                        message.sdkVer = reader.string();
                        break;
                    }
                case 43: {
                        message.frameworkVer = reader.string();
                        break;
                    }
                case 44: {
                        message.swanGameVer = reader.string();
                        break;
                    }
                case 49: {
                        message.activeTimestamp = reader.int64();
                        break;
                    }
                case 50: {
                        message.firstInstallTime = reader.int64();
                        break;
                    }
                case 51: {
                        message.lastUpdateTime = reader.int64();
                        break;
                    }
                case 53: {
                        message.eventDay = reader.string();
                        break;
                    }
                case 54: {
                        message.androidId = reader.string();
                        break;
                    }
                case 55: {
                        message.cmode = reader.int32();
                        break;
                    }
                case 56: {
                        message.startScheme = reader.string();
                        break;
                    }
                case 57: {
                        message.startType = reader.int32();
                        break;
                    }
                case 61: {
                        message.extra = reader.string();
                        break;
                    }
                case 62: {
                        message.userAgent = reader.string();
                        break;
                    }
                case 63: {
                        message.personalizedRecSwitch = reader.int32();
                        break;
                    }
                case 70: {
                        message.deviceScore = reader.string();
                        break;
                    }
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a CommonRequest message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof tieba.CommonRequest
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {tieba.CommonRequest} CommonRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        CommonRequest.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a CommonRequest message.
         * @function verify
         * @memberof tieba.CommonRequest
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        CommonRequest.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            let properties = {};
            if (message._clientType != null && message.hasOwnProperty("_clientType"))
                if (!$util.isInteger(message._clientType))
                    return "_clientType: integer expected";
            if (message._clientVersion != null && message.hasOwnProperty("_clientVersion"))
                if (!$util.isString(message._clientVersion))
                    return "_clientVersion: string expected";
            if (message._clientId != null && message.hasOwnProperty("_clientId"))
                if (!$util.isString(message._clientId))
                    return "_clientId: string expected";
            if (message._phoneImei != null && message.hasOwnProperty("_phoneImei"))
                if (!$util.isString(message._phoneImei))
                    return "_phoneImei: string expected";
            if (message.from != null && message.hasOwnProperty("from"))
                if (!$util.isString(message.from))
                    return "from: string expected";
            if (message.cuid != null && message.hasOwnProperty("cuid"))
                if (!$util.isString(message.cuid))
                    return "cuid: string expected";
            if (message._timestamp != null && message.hasOwnProperty("_timestamp"))
                if (!$util.isInteger(message._timestamp) && !(message._timestamp && $util.isInteger(message._timestamp.low) && $util.isInteger(message._timestamp.high)))
                    return "_timestamp: integer|Long expected";
            if (message.model != null && message.hasOwnProperty("model"))
                if (!$util.isString(message.model))
                    return "model: string expected";
            if (message.BDUSS != null && message.hasOwnProperty("BDUSS")) {
                properties._BDUSS = 1;
                if (!$util.isString(message.BDUSS))
                    return "BDUSS: string expected";
            }
            if (message.tbs != null && message.hasOwnProperty("tbs")) {
                properties._tbs = 1;
                if (!$util.isString(message.tbs))
                    return "tbs: string expected";
            }
            if (message.netType != null && message.hasOwnProperty("netType"))
                if (!$util.isInteger(message.netType))
                    return "netType: integer expected";
            if (message._phoneNewimei != null && message.hasOwnProperty("_phoneNewimei"))
                if (!$util.isString(message._phoneNewimei))
                    return "_phoneNewimei: string expected";
            if (message.sign != null && message.hasOwnProperty("sign")) {
                properties._sign = 1;
                if (!$util.isString(message.sign))
                    return "sign: string expected";
            }
            if (message.pversion != null && message.hasOwnProperty("pversion"))
                if (!$util.isString(message.pversion))
                    return "pversion: string expected";
            if (message._osVersion != null && message.hasOwnProperty("_osVersion"))
                if (!$util.isString(message._osVersion))
                    return "_osVersion: string expected";
            if (message.brand != null && message.hasOwnProperty("brand"))
                if (!$util.isString(message.brand))
                    return "brand: string expected";
            if (message.legoLibVersion != null && message.hasOwnProperty("legoLibVersion"))
                if (!$util.isString(message.legoLibVersion))
                    return "legoLibVersion: string expected";
            if (message.applist != null && message.hasOwnProperty("applist")) {
                properties._applist = 1;
                if (!$util.isString(message.applist))
                    return "applist: string expected";
            }
            if (message.stoken != null && message.hasOwnProperty("stoken")) {
                properties._stoken = 1;
                if (!$util.isString(message.stoken))
                    return "stoken: string expected";
            }
            if (message.zId != null && message.hasOwnProperty("zId")) {
                properties._zId = 1;
                if (!$util.isString(message.zId))
                    return "zId: string expected";
            }
            if (message.cuidGalaxy2 != null && message.hasOwnProperty("cuidGalaxy2"))
                if (!$util.isString(message.cuidGalaxy2))
                    return "cuidGalaxy2: string expected";
            if (message.cuidGid != null && message.hasOwnProperty("cuidGid")) {
                properties._cuidGid = 1;
                if (!$util.isString(message.cuidGid))
                    return "cuidGid: string expected";
            }
            if (message.oaid != null && message.hasOwnProperty("oaid")) {
                properties._oaid = 1;
                if (!$util.isString(message.oaid))
                    return "oaid: string expected";
            }
            if (message.c3Aid != null && message.hasOwnProperty("c3Aid"))
                if (!$util.isString(message.c3Aid))
                    return "c3Aid: string expected";
            if (message.sampleId != null && message.hasOwnProperty("sampleId")) {
                properties._sampleId = 1;
                if (!$util.isString(message.sampleId))
                    return "sampleId: string expected";
            }
            if (message.scrW != null && message.hasOwnProperty("scrW"))
                if (!$util.isInteger(message.scrW))
                    return "scrW: integer expected";
            if (message.scrH != null && message.hasOwnProperty("scrH"))
                if (!$util.isInteger(message.scrH))
                    return "scrH: integer expected";
            if (message.scrDip != null && message.hasOwnProperty("scrDip"))
                if (typeof message.scrDip !== "number")
                    return "scrDip: number expected";
            if (message.qType != null && message.hasOwnProperty("qType")) {
                properties._qType = 1;
                if (!$util.isInteger(message.qType))
                    return "qType: integer expected";
            }
            if (message.isTeenager != null && message.hasOwnProperty("isTeenager")) {
                properties._isTeenager = 1;
                if (!$util.isInteger(message.isTeenager))
                    return "isTeenager: integer expected";
            }
            if (message.sdkVer != null && message.hasOwnProperty("sdkVer"))
                if (!$util.isString(message.sdkVer))
                    return "sdkVer: string expected";
            if (message.frameworkVer != null && message.hasOwnProperty("frameworkVer"))
                if (!$util.isString(message.frameworkVer))
                    return "frameworkVer: string expected";
            if (message.swanGameVer != null && message.hasOwnProperty("swanGameVer"))
                if (!$util.isString(message.swanGameVer))
                    return "swanGameVer: string expected";
            if (message.activeTimestamp != null && message.hasOwnProperty("activeTimestamp"))
                if (!$util.isInteger(message.activeTimestamp) && !(message.activeTimestamp && $util.isInteger(message.activeTimestamp.low) && $util.isInteger(message.activeTimestamp.high)))
                    return "activeTimestamp: integer|Long expected";
            if (message.firstInstallTime != null && message.hasOwnProperty("firstInstallTime"))
                if (!$util.isInteger(message.firstInstallTime) && !(message.firstInstallTime && $util.isInteger(message.firstInstallTime.low) && $util.isInteger(message.firstInstallTime.high)))
                    return "firstInstallTime: integer|Long expected";
            if (message.lastUpdateTime != null && message.hasOwnProperty("lastUpdateTime"))
                if (!$util.isInteger(message.lastUpdateTime) && !(message.lastUpdateTime && $util.isInteger(message.lastUpdateTime.low) && $util.isInteger(message.lastUpdateTime.high)))
                    return "lastUpdateTime: integer|Long expected";
            if (message.eventDay != null && message.hasOwnProperty("eventDay"))
                if (!$util.isString(message.eventDay))
                    return "eventDay: string expected";
            if (message.androidId != null && message.hasOwnProperty("androidId"))
                if (!$util.isString(message.androidId))
                    return "androidId: string expected";
            if (message.cmode != null && message.hasOwnProperty("cmode"))
                if (!$util.isInteger(message.cmode))
                    return "cmode: integer expected";
            if (message.startScheme != null && message.hasOwnProperty("startScheme")) {
                properties._startScheme = 1;
                if (!$util.isString(message.startScheme))
                    return "startScheme: string expected";
            }
            if (message.startType != null && message.hasOwnProperty("startType"))
                if (!$util.isInteger(message.startType))
                    return "startType: integer expected";
            if (message.extra != null && message.hasOwnProperty("extra")) {
                properties._extra = 1;
                if (!$util.isString(message.extra))
                    return "extra: string expected";
            }
            if (message.userAgent != null && message.hasOwnProperty("userAgent"))
                if (!$util.isString(message.userAgent))
                    return "userAgent: string expected";
            if (message.personalizedRecSwitch != null && message.hasOwnProperty("personalizedRecSwitch"))
                if (!$util.isInteger(message.personalizedRecSwitch))
                    return "personalizedRecSwitch: integer expected";
            if (message.deviceScore != null && message.hasOwnProperty("deviceScore"))
                if (!$util.isString(message.deviceScore))
                    return "deviceScore: string expected";
            return null;
        };

        /**
         * Creates a CommonRequest message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof tieba.CommonRequest
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {tieba.CommonRequest} CommonRequest
         */
        CommonRequest.fromObject = function fromObject(object) {
            if (object instanceof $root.tieba.CommonRequest)
                return object;
            let message = new $root.tieba.CommonRequest();
            if (object._clientType != null)
                message._clientType = object._clientType | 0;
            if (object._clientVersion != null)
                message._clientVersion = String(object._clientVersion);
            if (object._clientId != null)
                message._clientId = String(object._clientId);
            if (object._phoneImei != null)
                message._phoneImei = String(object._phoneImei);
            if (object.from != null)
                message.from = String(object.from);
            if (object.cuid != null)
                message.cuid = String(object.cuid);
            if (object._timestamp != null)
                if ($util.Long)
                    (message._timestamp = $util.Long.fromValue(object._timestamp)).unsigned = false;
                else if (typeof object._timestamp === "string")
                    message._timestamp = parseInt(object._timestamp, 10);
                else if (typeof object._timestamp === "number")
                    message._timestamp = object._timestamp;
                else if (typeof object._timestamp === "object")
                    message._timestamp = new $util.LongBits(object._timestamp.low >>> 0, object._timestamp.high >>> 0).toNumber();
            if (object.model != null)
                message.model = String(object.model);
            if (object.BDUSS != null)
                message.BDUSS = String(object.BDUSS);
            if (object.tbs != null)
                message.tbs = String(object.tbs);
            if (object.netType != null)
                message.netType = object.netType | 0;
            if (object._phoneNewimei != null)
                message._phoneNewimei = String(object._phoneNewimei);
            if (object.sign != null)
                message.sign = String(object.sign);
            if (object.pversion != null)
                message.pversion = String(object.pversion);
            if (object._osVersion != null)
                message._osVersion = String(object._osVersion);
            if (object.brand != null)
                message.brand = String(object.brand);
            if (object.legoLibVersion != null)
                message.legoLibVersion = String(object.legoLibVersion);
            if (object.applist != null)
                message.applist = String(object.applist);
            if (object.stoken != null)
                message.stoken = String(object.stoken);
            if (object.zId != null)
                message.zId = String(object.zId);
            if (object.cuidGalaxy2 != null)
                message.cuidGalaxy2 = String(object.cuidGalaxy2);
            if (object.cuidGid != null)
                message.cuidGid = String(object.cuidGid);
            if (object.oaid != null)
                message.oaid = String(object.oaid);
            if (object.c3Aid != null)
                message.c3Aid = String(object.c3Aid);
            if (object.sampleId != null)
                message.sampleId = String(object.sampleId);
            if (object.scrW != null)
                message.scrW = object.scrW | 0;
            if (object.scrH != null)
                message.scrH = object.scrH | 0;
            if (object.scrDip != null)
                message.scrDip = Number(object.scrDip);
            if (object.qType != null)
                message.qType = object.qType | 0;
            if (object.isTeenager != null)
                message.isTeenager = object.isTeenager | 0;
            if (object.sdkVer != null)
                message.sdkVer = String(object.sdkVer);
            if (object.frameworkVer != null)
                message.frameworkVer = String(object.frameworkVer);
            if (object.swanGameVer != null)
                message.swanGameVer = String(object.swanGameVer);
            if (object.activeTimestamp != null)
                if ($util.Long)
                    (message.activeTimestamp = $util.Long.fromValue(object.activeTimestamp)).unsigned = false;
                else if (typeof object.activeTimestamp === "string")
                    message.activeTimestamp = parseInt(object.activeTimestamp, 10);
                else if (typeof object.activeTimestamp === "number")
                    message.activeTimestamp = object.activeTimestamp;
                else if (typeof object.activeTimestamp === "object")
                    message.activeTimestamp = new $util.LongBits(object.activeTimestamp.low >>> 0, object.activeTimestamp.high >>> 0).toNumber();
            if (object.firstInstallTime != null)
                if ($util.Long)
                    (message.firstInstallTime = $util.Long.fromValue(object.firstInstallTime)).unsigned = false;
                else if (typeof object.firstInstallTime === "string")
                    message.firstInstallTime = parseInt(object.firstInstallTime, 10);
                else if (typeof object.firstInstallTime === "number")
                    message.firstInstallTime = object.firstInstallTime;
                else if (typeof object.firstInstallTime === "object")
                    message.firstInstallTime = new $util.LongBits(object.firstInstallTime.low >>> 0, object.firstInstallTime.high >>> 0).toNumber();
            if (object.lastUpdateTime != null)
                if ($util.Long)
                    (message.lastUpdateTime = $util.Long.fromValue(object.lastUpdateTime)).unsigned = false;
                else if (typeof object.lastUpdateTime === "string")
                    message.lastUpdateTime = parseInt(object.lastUpdateTime, 10);
                else if (typeof object.lastUpdateTime === "number")
                    message.lastUpdateTime = object.lastUpdateTime;
                else if (typeof object.lastUpdateTime === "object")
                    message.lastUpdateTime = new $util.LongBits(object.lastUpdateTime.low >>> 0, object.lastUpdateTime.high >>> 0).toNumber();
            if (object.eventDay != null)
                message.eventDay = String(object.eventDay);
            if (object.androidId != null)
                message.androidId = String(object.androidId);
            if (object.cmode != null)
                message.cmode = object.cmode | 0;
            if (object.startScheme != null)
                message.startScheme = String(object.startScheme);
            if (object.startType != null)
                message.startType = object.startType | 0;
            if (object.extra != null)
                message.extra = String(object.extra);
            if (object.userAgent != null)
                message.userAgent = String(object.userAgent);
            if (object.personalizedRecSwitch != null)
                message.personalizedRecSwitch = object.personalizedRecSwitch | 0;
            if (object.deviceScore != null)
                message.deviceScore = String(object.deviceScore);
            return message;
        };

        /**
         * Creates a plain object from a CommonRequest message. Also converts values to other types if specified.
         * @function toObject
         * @memberof tieba.CommonRequest
         * @static
         * @param {tieba.CommonRequest} message CommonRequest
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        CommonRequest.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            let object = {};
            if (options.defaults) {
                object._clientType = 0;
                object._clientVersion = "";
                object._clientId = "";
                object._phoneImei = "";
                object.from = "";
                object.cuid = "";
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object._timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object._timestamp = options.longs === String ? "0" : 0;
                object.model = "";
                object.netType = 0;
                object._phoneNewimei = "";
                object.pversion = "";
                object._osVersion = "";
                object.brand = "";
                object.legoLibVersion = "";
                object.cuidGalaxy2 = "";
                object.c3Aid = "";
                object.scrW = 0;
                object.scrH = 0;
                object.scrDip = 0;
                object.sdkVer = "";
                object.frameworkVer = "";
                object.swanGameVer = "";
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.activeTimestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.activeTimestamp = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.firstInstallTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.firstInstallTime = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    let long = new $util.Long(0, 0, false);
                    object.lastUpdateTime = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.lastUpdateTime = options.longs === String ? "0" : 0;
                object.eventDay = "";
                object.androidId = "";
                object.cmode = 0;
                object.startType = 0;
                object.userAgent = "";
                object.personalizedRecSwitch = 0;
                object.deviceScore = "";
            }
            if (message._clientType != null && message.hasOwnProperty("_clientType"))
                object._clientType = message._clientType;
            if (message._clientVersion != null && message.hasOwnProperty("_clientVersion"))
                object._clientVersion = message._clientVersion;
            if (message._clientId != null && message.hasOwnProperty("_clientId"))
                object._clientId = message._clientId;
            if (message._phoneImei != null && message.hasOwnProperty("_phoneImei"))
                object._phoneImei = message._phoneImei;
            if (message.from != null && message.hasOwnProperty("from"))
                object.from = message.from;
            if (message.cuid != null && message.hasOwnProperty("cuid"))
                object.cuid = message.cuid;
            if (message._timestamp != null && message.hasOwnProperty("_timestamp"))
                if (typeof message._timestamp === "number")
                    object._timestamp = options.longs === String ? String(message._timestamp) : message._timestamp;
                else
                    object._timestamp = options.longs === String ? $util.Long.prototype.toString.call(message._timestamp) : options.longs === Number ? new $util.LongBits(message._timestamp.low >>> 0, message._timestamp.high >>> 0).toNumber() : message._timestamp;
            if (message.model != null && message.hasOwnProperty("model"))
                object.model = message.model;
            if (message.BDUSS != null && message.hasOwnProperty("BDUSS")) {
                object.BDUSS = message.BDUSS;
                if (options.oneofs)
                    object._BDUSS = "BDUSS";
            }
            if (message.tbs != null && message.hasOwnProperty("tbs")) {
                object.tbs = message.tbs;
                if (options.oneofs)
                    object._tbs = "tbs";
            }
            if (message.netType != null && message.hasOwnProperty("netType"))
                object.netType = message.netType;
            if (message._phoneNewimei != null && message.hasOwnProperty("_phoneNewimei"))
                object._phoneNewimei = message._phoneNewimei;
            if (message.sign != null && message.hasOwnProperty("sign")) {
                object.sign = message.sign;
                if (options.oneofs)
                    object._sign = "sign";
            }
            if (message.pversion != null && message.hasOwnProperty("pversion"))
                object.pversion = message.pversion;
            if (message._osVersion != null && message.hasOwnProperty("_osVersion"))
                object._osVersion = message._osVersion;
            if (message.brand != null && message.hasOwnProperty("brand"))
                object.brand = message.brand;
            if (message.legoLibVersion != null && message.hasOwnProperty("legoLibVersion"))
                object.legoLibVersion = message.legoLibVersion;
            if (message.applist != null && message.hasOwnProperty("applist")) {
                object.applist = message.applist;
                if (options.oneofs)
                    object._applist = "applist";
            }
            if (message.stoken != null && message.hasOwnProperty("stoken")) {
                object.stoken = message.stoken;
                if (options.oneofs)
                    object._stoken = "stoken";
            }
            if (message.zId != null && message.hasOwnProperty("zId")) {
                object.zId = message.zId;
                if (options.oneofs)
                    object._zId = "zId";
            }
            if (message.cuidGalaxy2 != null && message.hasOwnProperty("cuidGalaxy2"))
                object.cuidGalaxy2 = message.cuidGalaxy2;
            if (message.cuidGid != null && message.hasOwnProperty("cuidGid")) {
                object.cuidGid = message.cuidGid;
                if (options.oneofs)
                    object._cuidGid = "cuidGid";
            }
            if (message.oaid != null && message.hasOwnProperty("oaid")) {
                object.oaid = message.oaid;
                if (options.oneofs)
                    object._oaid = "oaid";
            }
            if (message.c3Aid != null && message.hasOwnProperty("c3Aid"))
                object.c3Aid = message.c3Aid;
            if (message.sampleId != null && message.hasOwnProperty("sampleId")) {
                object.sampleId = message.sampleId;
                if (options.oneofs)
                    object._sampleId = "sampleId";
            }
            if (message.scrW != null && message.hasOwnProperty("scrW"))
                object.scrW = message.scrW;
            if (message.scrH != null && message.hasOwnProperty("scrH"))
                object.scrH = message.scrH;
            if (message.scrDip != null && message.hasOwnProperty("scrDip"))
                object.scrDip = options.json && !isFinite(message.scrDip) ? String(message.scrDip) : message.scrDip;
            if (message.qType != null && message.hasOwnProperty("qType")) {
                object.qType = message.qType;
                if (options.oneofs)
                    object._qType = "qType";
            }
            if (message.isTeenager != null && message.hasOwnProperty("isTeenager")) {
                object.isTeenager = message.isTeenager;
                if (options.oneofs)
                    object._isTeenager = "isTeenager";
            }
            if (message.sdkVer != null && message.hasOwnProperty("sdkVer"))
                object.sdkVer = message.sdkVer;
            if (message.frameworkVer != null && message.hasOwnProperty("frameworkVer"))
                object.frameworkVer = message.frameworkVer;
            if (message.swanGameVer != null && message.hasOwnProperty("swanGameVer"))
                object.swanGameVer = message.swanGameVer;
            if (message.activeTimestamp != null && message.hasOwnProperty("activeTimestamp"))
                if (typeof message.activeTimestamp === "number")
                    object.activeTimestamp = options.longs === String ? String(message.activeTimestamp) : message.activeTimestamp;
                else
                    object.activeTimestamp = options.longs === String ? $util.Long.prototype.toString.call(message.activeTimestamp) : options.longs === Number ? new $util.LongBits(message.activeTimestamp.low >>> 0, message.activeTimestamp.high >>> 0).toNumber() : message.activeTimestamp;
            if (message.firstInstallTime != null && message.hasOwnProperty("firstInstallTime"))
                if (typeof message.firstInstallTime === "number")
                    object.firstInstallTime = options.longs === String ? String(message.firstInstallTime) : message.firstInstallTime;
                else
                    object.firstInstallTime = options.longs === String ? $util.Long.prototype.toString.call(message.firstInstallTime) : options.longs === Number ? new $util.LongBits(message.firstInstallTime.low >>> 0, message.firstInstallTime.high >>> 0).toNumber() : message.firstInstallTime;
            if (message.lastUpdateTime != null && message.hasOwnProperty("lastUpdateTime"))
                if (typeof message.lastUpdateTime === "number")
                    object.lastUpdateTime = options.longs === String ? String(message.lastUpdateTime) : message.lastUpdateTime;
                else
                    object.lastUpdateTime = options.longs === String ? $util.Long.prototype.toString.call(message.lastUpdateTime) : options.longs === Number ? new $util.LongBits(message.lastUpdateTime.low >>> 0, message.lastUpdateTime.high >>> 0).toNumber() : message.lastUpdateTime;
            if (message.eventDay != null && message.hasOwnProperty("eventDay"))
                object.eventDay = message.eventDay;
            if (message.androidId != null && message.hasOwnProperty("androidId"))
                object.androidId = message.androidId;
            if (message.cmode != null && message.hasOwnProperty("cmode"))
                object.cmode = message.cmode;
            if (message.startScheme != null && message.hasOwnProperty("startScheme")) {
                object.startScheme = message.startScheme;
                if (options.oneofs)
                    object._startScheme = "startScheme";
            }
            if (message.startType != null && message.hasOwnProperty("startType"))
                object.startType = message.startType;
            if (message.extra != null && message.hasOwnProperty("extra")) {
                object.extra = message.extra;
                if (options.oneofs)
                    object._extra = "extra";
            }
            if (message.userAgent != null && message.hasOwnProperty("userAgent"))
                object.userAgent = message.userAgent;
            if (message.personalizedRecSwitch != null && message.hasOwnProperty("personalizedRecSwitch"))
                object.personalizedRecSwitch = message.personalizedRecSwitch;
            if (message.deviceScore != null && message.hasOwnProperty("deviceScore"))
                object.deviceScore = message.deviceScore;
            return object;
        };

        /**
         * Converts this CommonRequest to JSON.
         * @function toJSON
         * @memberof tieba.CommonRequest
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        CommonRequest.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for CommonRequest
         * @function getTypeUrl
         * @memberof tieba.CommonRequest
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        CommonRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/tieba.CommonRequest";
        };

        return CommonRequest;
    })();

    return tieba;
})();

export { $root as default };
