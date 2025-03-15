/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const UserPostReqIdl = $root.UserPostReqIdl = (() => {

    /**
     * Properties of a UserPostReqIdl.
     * @exports IUserPostReqIdl
     * @interface IUserPostReqIdl
     * @property {IDataReq|null} [data] UserPostReqIdl data
     */

    /**
     * Constructs a new UserPostReqIdl.
     * @exports UserPostReqIdl
     * @classdesc Represents a UserPostReqIdl.
     * @implements IUserPostReqIdl
     * @constructor
     * @param {IUserPostReqIdl=} [properties] Properties to set
     */
    function UserPostReqIdl(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * UserPostReqIdl data.
     * @member {IDataReq|null|undefined} data
     * @memberof UserPostReqIdl
     * @instance
     */
    UserPostReqIdl.prototype.data = null;

    /**
     * Creates a new UserPostReqIdl instance using the specified properties.
     * @function create
     * @memberof UserPostReqIdl
     * @static
     * @param {IUserPostReqIdl=} [properties] Properties to set
     * @returns {UserPostReqIdl} UserPostReqIdl instance
     */
    UserPostReqIdl.create = function create(properties) {
        return new UserPostReqIdl(properties);
    };

    /**
     * Encodes the specified UserPostReqIdl message. Does not implicitly {@link UserPostReqIdl.verify|verify} messages.
     * @function encode
     * @memberof UserPostReqIdl
     * @static
     * @param {IUserPostReqIdl} message UserPostReqIdl message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    UserPostReqIdl.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message.data != null && Object.hasOwnProperty.call(message, "data"))
            $root.DataReq.encode(message.data, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
        return writer;
    };

    /**
     * Encodes the specified UserPostReqIdl message, length delimited. Does not implicitly {@link UserPostReqIdl.verify|verify} messages.
     * @function encodeDelimited
     * @memberof UserPostReqIdl
     * @static
     * @param {IUserPostReqIdl} message UserPostReqIdl message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    UserPostReqIdl.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a UserPostReqIdl message from the specified reader or buffer.
     * @function decode
     * @memberof UserPostReqIdl
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {UserPostReqIdl} UserPostReqIdl
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    UserPostReqIdl.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.UserPostReqIdl();
        while (reader.pos < end) {
            let tag = reader.uint32();
            switch (tag >>> 3) {
            case 1: {
                    message.data = $root.DataReq.decode(reader, reader.uint32());
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
     * Decodes a UserPostReqIdl message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof UserPostReqIdl
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {UserPostReqIdl} UserPostReqIdl
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    UserPostReqIdl.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a UserPostReqIdl message.
     * @function verify
     * @memberof UserPostReqIdl
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    UserPostReqIdl.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.data != null && message.hasOwnProperty("data")) {
            let error = $root.DataReq.verify(message.data);
            if (error)
                return "data." + error;
        }
        return null;
    };

    /**
     * Creates a UserPostReqIdl message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof UserPostReqIdl
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {UserPostReqIdl} UserPostReqIdl
     */
    UserPostReqIdl.fromObject = function fromObject(object) {
        if (object instanceof $root.UserPostReqIdl)
            return object;
        let message = new $root.UserPostReqIdl();
        if (object.data != null) {
            if (typeof object.data !== "object")
                throw TypeError(".UserPostReqIdl.data: object expected");
            message.data = $root.DataReq.fromObject(object.data);
        }
        return message;
    };

    /**
     * Creates a plain object from a UserPostReqIdl message. Also converts values to other types if specified.
     * @function toObject
     * @memberof UserPostReqIdl
     * @static
     * @param {UserPostReqIdl} message UserPostReqIdl
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    UserPostReqIdl.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults)
            object.data = null;
        if (message.data != null && message.hasOwnProperty("data"))
            object.data = $root.DataReq.toObject(message.data, options);
        return object;
    };

    /**
     * Converts this UserPostReqIdl to JSON.
     * @function toJSON
     * @memberof UserPostReqIdl
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    UserPostReqIdl.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for UserPostReqIdl
     * @function getTypeUrl
     * @memberof UserPostReqIdl
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    UserPostReqIdl.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/UserPostReqIdl";
    };

    return UserPostReqIdl;
})();

export const DataReq = $root.DataReq = (() => {

    /**
     * Properties of a DataReq.
     * @exports IDataReq
     * @interface IDataReq
     * @property {number|Long|null} [uid] DataReq uid
     * @property {number|null} [rn] DataReq rn
     * @property {number|null} [offset] DataReq offset
     * @property {number|null} [isThread] DataReq isThread
     * @property {number|null} [needContent] DataReq needContent
     * @property {number|Long|null} [forumId] DataReq forumId
     * @property {number|null} [beginTime] DataReq beginTime
     * @property {number|null} [endTime] DataReq endTime
     * @property {number|null} [subtype] DataReq subtype
     * @property {number|null} [checkLogin] DataReq checkLogin
     * @property {string|null} [ipStr] DataReq ipStr
     * @property {number|null} [ipInt] DataReq ipInt
     * @property {string|null} [moduleName] DataReq moduleName
     * @property {number|null} [stType] DataReq stType
     * @property {number|null} [stParam] DataReq stParam
     * @property {number|null} [smileGrade] DataReq smileGrade
     * @property {number|null} [supportNoun] DataReq supportNoun
     * @property {number|null} [login] DataReq login
     * @property {number|Long|null} [userId] DataReq userId
     * @property {string|null} [userName] DataReq userName
     * @property {number|null} [noUn] DataReq noUn
     * @property {string|null} [portrait] DataReq portrait
     * @property {string|null} [mobile] DataReq mobile
     * @property {string|null} [email] DataReq email
     * @property {string|null} [cookie] DataReq cookie
     * @property {number|null} [pn] DataReq pn
     * @property {number|null} [isTwzhibo] DataReq isTwzhibo
     * @property {number|null} [scrW] DataReq scrW
     * @property {number|null} [scrH] DataReq scrH
     * @property {number|null} [scrDip] DataReq scrDip
     * @property {number|null} [qType] DataReq qType
     * @property {number|null} [isViewCard] DataReq isViewCard
     * @property {number|null} [lastThreadTime] DataReq lastThreadTime
     * @property {number|null} [workTabId] DataReq workTabId
     * @property {number|null} [type] DataReq type
     * @property {number|null} [fromType] DataReq fromType
     * @property {number|Long|null} [beginThreadId] DataReq beginThreadId
     */

    /**
     * Constructs a new DataReq.
     * @exports DataReq
     * @classdesc Represents a DataReq.
     * @implements IDataReq
     * @constructor
     * @param {IDataReq=} [properties] Properties to set
     */
    function DataReq(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * DataReq uid.
     * @member {number|Long} uid
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.uid = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * DataReq rn.
     * @member {number} rn
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.rn = 0;

    /**
     * DataReq offset.
     * @member {number} offset
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.offset = 0;

    /**
     * DataReq isThread.
     * @member {number} isThread
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.isThread = 0;

    /**
     * DataReq needContent.
     * @member {number} needContent
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.needContent = 0;

    /**
     * DataReq forumId.
     * @member {number|Long} forumId
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.forumId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * DataReq beginTime.
     * @member {number} beginTime
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.beginTime = 0;

    /**
     * DataReq endTime.
     * @member {number} endTime
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.endTime = 0;

    /**
     * DataReq subtype.
     * @member {number} subtype
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.subtype = 0;

    /**
     * DataReq checkLogin.
     * @member {number} checkLogin
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.checkLogin = 0;

    /**
     * DataReq ipStr.
     * @member {string} ipStr
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.ipStr = "";

    /**
     * DataReq ipInt.
     * @member {number} ipInt
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.ipInt = 0;

    /**
     * DataReq moduleName.
     * @member {string} moduleName
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.moduleName = "";

    /**
     * DataReq stType.
     * @member {number} stType
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.stType = 0;

    /**
     * DataReq stParam.
     * @member {number} stParam
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.stParam = 0;

    /**
     * DataReq smileGrade.
     * @member {number} smileGrade
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.smileGrade = 0;

    /**
     * DataReq supportNoun.
     * @member {number} supportNoun
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.supportNoun = 0;

    /**
     * DataReq login.
     * @member {number} login
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.login = 0;

    /**
     * DataReq userId.
     * @member {number|Long} userId
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.userId = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * DataReq userName.
     * @member {string} userName
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.userName = "";

    /**
     * DataReq noUn.
     * @member {number} noUn
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.noUn = 0;

    /**
     * DataReq portrait.
     * @member {string} portrait
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.portrait = "";

    /**
     * DataReq mobile.
     * @member {string} mobile
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.mobile = "";

    /**
     * DataReq email.
     * @member {string} email
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.email = "";

    /**
     * DataReq cookie.
     * @member {string} cookie
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.cookie = "";

    /**
     * DataReq pn.
     * @member {number} pn
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.pn = 0;

    /**
     * DataReq isTwzhibo.
     * @member {number} isTwzhibo
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.isTwzhibo = 0;

    /**
     * DataReq scrW.
     * @member {number} scrW
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.scrW = 0;

    /**
     * DataReq scrH.
     * @member {number} scrH
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.scrH = 0;

    /**
     * DataReq scrDip.
     * @member {number} scrDip
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.scrDip = 0;

    /**
     * DataReq qType.
     * @member {number} qType
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.qType = 0;

    /**
     * DataReq isViewCard.
     * @member {number} isViewCard
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.isViewCard = 0;

    /**
     * DataReq lastThreadTime.
     * @member {number} lastThreadTime
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.lastThreadTime = 0;

    /**
     * DataReq workTabId.
     * @member {number} workTabId
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.workTabId = 0;

    /**
     * DataReq type.
     * @member {number} type
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.type = 0;

    /**
     * DataReq fromType.
     * @member {number} fromType
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.fromType = 0;

    /**
     * DataReq beginThreadId.
     * @member {number|Long} beginThreadId
     * @memberof DataReq
     * @instance
     */
    DataReq.prototype.beginThreadId = $util.Long ? $util.Long.fromBits(0,0,true) : 0;

    /**
     * Creates a new DataReq instance using the specified properties.
     * @function create
     * @memberof DataReq
     * @static
     * @param {IDataReq=} [properties] Properties to set
     * @returns {DataReq} DataReq instance
     */
    DataReq.create = function create(properties) {
        return new DataReq(properties);
    };

    /**
     * Encodes the specified DataReq message. Does not implicitly {@link DataReq.verify|verify} messages.
     * @function encode
     * @memberof DataReq
     * @static
     * @param {IDataReq} message DataReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DataReq.encode = function encode(message, writer) {
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
     * Encodes the specified DataReq message, length delimited. Does not implicitly {@link DataReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof DataReq
     * @static
     * @param {IDataReq} message DataReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    DataReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a DataReq message from the specified reader or buffer.
     * @function decode
     * @memberof DataReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {DataReq} DataReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DataReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.DataReq();
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
     * Decodes a DataReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof DataReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {DataReq} DataReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    DataReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a DataReq message.
     * @function verify
     * @memberof DataReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    DataReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message.uid != null && message.hasOwnProperty("uid"))
            if (!$util.isInteger(message.uid) && !(message.uid && $util.isInteger(message.uid.low) && $util.isInteger(message.uid.high)))
                return "uid: integer|Long expected";
        if (message.rn != null && message.hasOwnProperty("rn"))
            if (!$util.isInteger(message.rn))
                return "rn: integer expected";
        if (message.offset != null && message.hasOwnProperty("offset"))
            if (!$util.isInteger(message.offset))
                return "offset: integer expected";
        if (message.isThread != null && message.hasOwnProperty("isThread"))
            if (!$util.isInteger(message.isThread))
                return "isThread: integer expected";
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
        if (message.subtype != null && message.hasOwnProperty("subtype"))
            if (!$util.isInteger(message.subtype))
                return "subtype: integer expected";
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
        if (message.isViewCard != null && message.hasOwnProperty("isViewCard"))
            if (!$util.isInteger(message.isViewCard))
                return "isViewCard: integer expected";
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
     * Creates a DataReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof DataReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {DataReq} DataReq
     */
    DataReq.fromObject = function fromObject(object) {
        if (object instanceof $root.DataReq)
            return object;
        let message = new $root.DataReq();
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
     * Creates a plain object from a DataReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof DataReq
     * @static
     * @param {DataReq} message DataReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    DataReq.toObject = function toObject(message, options) {
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
            object.isThread = 0;
            object.needContent = 0;
            if ($util.Long) {
                let long = new $util.Long(0, 0, true);
                object.forumId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object.forumId = options.longs === String ? "0" : 0;
            object.beginTime = 0;
            object.endTime = 0;
            object.subtype = 0;
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
            object.isTwzhibo = 0;
            object.scrW = 0;
            object.scrH = 0;
            object.scrDip = 0;
            object.qType = 0;
            object.isViewCard = 0;
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
        if (message.isThread != null && message.hasOwnProperty("isThread"))
            object.isThread = message.isThread;
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
        if (message.subtype != null && message.hasOwnProperty("subtype"))
            object.subtype = message.subtype;
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
        if (message.isViewCard != null && message.hasOwnProperty("isViewCard"))
            object.isViewCard = message.isViewCard;
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
     * Converts this DataReq to JSON.
     * @function toJSON
     * @memberof DataReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    DataReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for DataReq
     * @function getTypeUrl
     * @memberof DataReq
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    DataReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/DataReq";
    };

    return DataReq;
})();

export const CommonReq = $root.CommonReq = (() => {

    /**
     * Properties of a CommonReq.
     * @exports ICommonReq
     * @interface ICommonReq
     * @property {number|null} [_clientType] CommonReq _clientType
     * @property {string|null} [_clientVersion] CommonReq _clientVersion
     * @property {string|null} [_clientId] CommonReq _clientId
     * @property {string|null} [apid] CommonReq apid
     * @property {string|null} [_phoneImei] CommonReq _phoneImei
     * @property {string|null} [from] CommonReq from
     * @property {string|null} [cuid] CommonReq cuid
     * @property {number|Long|null} [_timestamp] CommonReq _timestamp
     * @property {string|null} [model] CommonReq model
     * @property {string|null} [BDUSS] CommonReq BDUSS
     * @property {string|null} [tbs] CommonReq tbs
     * @property {number|null} [netType] CommonReq netType
     * @property {string|null} [subappType] CommonReq subappType
     * @property {string|null} [_phoneNewimei] CommonReq _phoneNewimei
     * @property {string|null} [ka] CommonReq ka
     * @property {string|null} [mApi] CommonReq mApi
     * @property {string|null} [mLogid] CommonReq mLogid
     * @property {string|null} [mCost] CommonReq mCost
     * @property {string|null} [mResult] CommonReq mResult
     * @property {string|null} [mSizeU] CommonReq mSizeU
     * @property {string|null} [mSizeD] CommonReq mSizeD
     * @property {string|null} [smallflow] CommonReq smallflow
     * @property {string|null} [sign] CommonReq sign
     * @property {string|null} [pversion] CommonReq pversion
     * @property {string|null} [_osVersion] CommonReq _osVersion
     * @property {string|null} [brand] CommonReq brand
     * @property {string|null} [brandType] CommonReq brandType
     * @property {string|null} [legoLibVersion] CommonReq legoLibVersion
     * @property {string|null} [applist] CommonReq applist
     * @property {string|null} [stoken] CommonReq stoken
     * @property {string|null} [zId] CommonReq zId
     * @property {string|null} [cuidGalaxy2] CommonReq cuidGalaxy2
     * @property {string|null} [cuidGid] CommonReq cuidGid
     * @property {string|null} [oaid] CommonReq oaid
     * @property {string|null} [c3Aid] CommonReq c3Aid
     * @property {string|null} [sampleId] CommonReq sampleId
     * @property {number|null} [scrW] CommonReq scrW
     * @property {number|null} [scrH] CommonReq scrH
     * @property {number|null} [scrDip] CommonReq scrDip
     * @property {number|null} [qType] CommonReq qType
     * @property {number|null} [isTeenager] CommonReq isTeenager
     * @property {string|null} [sdkVer] CommonReq sdkVer
     * @property {string|null} [frameworkVer] CommonReq frameworkVer
     * @property {string|null} [nawsGameVer] CommonReq nawsGameVer
     * @property {string|null} [idfa] CommonReq idfa
     * @property {string|null} [diac] CommonReq diac
     * @property {number|Long|null} [activeTimestamp] CommonReq activeTimestamp
     * @property {number|Long|null} [firstInstallTime] CommonReq firstInstallTime
     * @property {number|Long|null} [lastUpdateTime] CommonReq lastUpdateTime
     * @property {string|null} [eventDay] CommonReq eventDay
     * @property {string|null} [androidId] CommonReq androidId
     * @property {number|null} [cmode] CommonReq cmode
     * @property {string|null} [startScheme] CommonReq startScheme
     * @property {number|null} [startType] CommonReq startType
     * @property {string|null} [shoubaiCuid] CommonReq shoubaiCuid
     * @property {string|null} [mac] CommonReq mac
     * @property {string|null} [idfv] CommonReq idfv
     * @property {string|null} [extra] CommonReq extra
     * @property {string|null} [userAgent] CommonReq userAgent
     * @property {number|null} [personalizedRecSwitch] CommonReq personalizedRecSwitch
     * @property {string|null} [iemi] CommonReq iemi
     * @property {string|null} [iemiwen] CommonReq iemiwen
     * @property {string|null} [cam] CommonReq cam
     * @property {string|null} [afdi] CommonReq afdi
     * @property {string|null} [diDiordna] CommonReq diDiordna
     * @property {string|null} [vfdi] CommonReq vfdi
     * @property {string|null} [deviceScore] CommonReq deviceScore
     * @property {number|null} [pureMode] CommonReq pureMode
     * @property {number|null} [xcxMode] CommonReq xcxMode
     * @property {string|null} [ledom] CommonReq ledom
     * @property {string|null} [diao] CommonReq diao
     * @property {string|null} [noisrevSo] CommonReq noisrevSo
     * @property {string|null} [dnarb] CommonReq dnarb
     * @property {string|null} [epytDnarb] CommonReq epytDnarb
     * @property {string|null} [wRcs] CommonReq wRcs
     * @property {string|null} [hRcs] CommonReq hRcs
     * @property {string|null} [pidRcs] CommonReq pidRcs
     * @property {number|null} [needDecrypt] CommonReq needDecrypt
     * @property {number|null} [needCamDecrypt] CommonReq needCamDecrypt
     */

    /**
     * Constructs a new CommonReq.
     * @exports CommonReq
     * @classdesc Represents a CommonReq.
     * @implements ICommonReq
     * @constructor
     * @param {ICommonReq=} [properties] Properties to set
     */
    function CommonReq(properties) {
        if (properties)
            for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                if (properties[keys[i]] != null)
                    this[keys[i]] = properties[keys[i]];
    }

    /**
     * CommonReq _clientType.
     * @member {number} _clientType
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype._clientType = 0;

    /**
     * CommonReq _clientVersion.
     * @member {string} _clientVersion
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype._clientVersion = "";

    /**
     * CommonReq _clientId.
     * @member {string} _clientId
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype._clientId = "";

    /**
     * CommonReq apid.
     * @member {string} apid
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.apid = "";

    /**
     * CommonReq _phoneImei.
     * @member {string} _phoneImei
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype._phoneImei = "";

    /**
     * CommonReq from.
     * @member {string} from
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.from = "";

    /**
     * CommonReq cuid.
     * @member {string} cuid
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.cuid = "";

    /**
     * CommonReq _timestamp.
     * @member {number|Long} _timestamp
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype._timestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * CommonReq model.
     * @member {string} model
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.model = "";

    /**
     * CommonReq BDUSS.
     * @member {string} BDUSS
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.BDUSS = "";

    /**
     * CommonReq tbs.
     * @member {string} tbs
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.tbs = "";

    /**
     * CommonReq netType.
     * @member {number} netType
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.netType = 0;

    /**
     * CommonReq subappType.
     * @member {string} subappType
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.subappType = "";

    /**
     * CommonReq _phoneNewimei.
     * @member {string} _phoneNewimei
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype._phoneNewimei = "";

    /**
     * CommonReq ka.
     * @member {string} ka
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.ka = "";

    /**
     * CommonReq mApi.
     * @member {string} mApi
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.mApi = "";

    /**
     * CommonReq mLogid.
     * @member {string} mLogid
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.mLogid = "";

    /**
     * CommonReq mCost.
     * @member {string} mCost
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.mCost = "";

    /**
     * CommonReq mResult.
     * @member {string} mResult
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.mResult = "";

    /**
     * CommonReq mSizeU.
     * @member {string} mSizeU
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.mSizeU = "";

    /**
     * CommonReq mSizeD.
     * @member {string} mSizeD
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.mSizeD = "";

    /**
     * CommonReq smallflow.
     * @member {string} smallflow
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.smallflow = "";

    /**
     * CommonReq sign.
     * @member {string} sign
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.sign = "";

    /**
     * CommonReq pversion.
     * @member {string} pversion
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.pversion = "";

    /**
     * CommonReq _osVersion.
     * @member {string} _osVersion
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype._osVersion = "";

    /**
     * CommonReq brand.
     * @member {string} brand
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.brand = "";

    /**
     * CommonReq brandType.
     * @member {string} brandType
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.brandType = "";

    /**
     * CommonReq legoLibVersion.
     * @member {string} legoLibVersion
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.legoLibVersion = "";

    /**
     * CommonReq applist.
     * @member {string} applist
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.applist = "";

    /**
     * CommonReq stoken.
     * @member {string} stoken
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.stoken = "";

    /**
     * CommonReq zId.
     * @member {string} zId
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.zId = "";

    /**
     * CommonReq cuidGalaxy2.
     * @member {string} cuidGalaxy2
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.cuidGalaxy2 = "";

    /**
     * CommonReq cuidGid.
     * @member {string} cuidGid
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.cuidGid = "";

    /**
     * CommonReq oaid.
     * @member {string} oaid
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.oaid = "";

    /**
     * CommonReq c3Aid.
     * @member {string} c3Aid
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.c3Aid = "";

    /**
     * CommonReq sampleId.
     * @member {string} sampleId
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.sampleId = "";

    /**
     * CommonReq scrW.
     * @member {number} scrW
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.scrW = 0;

    /**
     * CommonReq scrH.
     * @member {number} scrH
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.scrH = 0;

    /**
     * CommonReq scrDip.
     * @member {number} scrDip
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.scrDip = 0;

    /**
     * CommonReq qType.
     * @member {number} qType
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.qType = 0;

    /**
     * CommonReq isTeenager.
     * @member {number} isTeenager
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.isTeenager = 0;

    /**
     * CommonReq sdkVer.
     * @member {string} sdkVer
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.sdkVer = "";

    /**
     * CommonReq frameworkVer.
     * @member {string} frameworkVer
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.frameworkVer = "";

    /**
     * CommonReq nawsGameVer.
     * @member {string} nawsGameVer
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.nawsGameVer = "";

    /**
     * CommonReq idfa.
     * @member {string} idfa
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.idfa = "";

    /**
     * CommonReq diac.
     * @member {string} diac
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.diac = "";

    /**
     * CommonReq activeTimestamp.
     * @member {number|Long} activeTimestamp
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.activeTimestamp = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * CommonReq firstInstallTime.
     * @member {number|Long} firstInstallTime
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.firstInstallTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * CommonReq lastUpdateTime.
     * @member {number|Long} lastUpdateTime
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.lastUpdateTime = $util.Long ? $util.Long.fromBits(0,0,false) : 0;

    /**
     * CommonReq eventDay.
     * @member {string} eventDay
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.eventDay = "";

    /**
     * CommonReq androidId.
     * @member {string} androidId
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.androidId = "";

    /**
     * CommonReq cmode.
     * @member {number} cmode
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.cmode = 0;

    /**
     * CommonReq startScheme.
     * @member {string} startScheme
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.startScheme = "";

    /**
     * CommonReq startType.
     * @member {number} startType
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.startType = 0;

    /**
     * CommonReq shoubaiCuid.
     * @member {string} shoubaiCuid
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.shoubaiCuid = "";

    /**
     * CommonReq mac.
     * @member {string} mac
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.mac = "";

    /**
     * CommonReq idfv.
     * @member {string} idfv
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.idfv = "";

    /**
     * CommonReq extra.
     * @member {string} extra
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.extra = "";

    /**
     * CommonReq userAgent.
     * @member {string} userAgent
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.userAgent = "";

    /**
     * CommonReq personalizedRecSwitch.
     * @member {number} personalizedRecSwitch
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.personalizedRecSwitch = 0;

    /**
     * CommonReq iemi.
     * @member {string} iemi
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.iemi = "";

    /**
     * CommonReq iemiwen.
     * @member {string} iemiwen
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.iemiwen = "";

    /**
     * CommonReq cam.
     * @member {string} cam
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.cam = "";

    /**
     * CommonReq afdi.
     * @member {string} afdi
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.afdi = "";

    /**
     * CommonReq diDiordna.
     * @member {string} diDiordna
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.diDiordna = "";

    /**
     * CommonReq vfdi.
     * @member {string} vfdi
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.vfdi = "";

    /**
     * CommonReq deviceScore.
     * @member {string} deviceScore
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.deviceScore = "";

    /**
     * CommonReq pureMode.
     * @member {number} pureMode
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.pureMode = 0;

    /**
     * CommonReq xcxMode.
     * @member {number} xcxMode
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.xcxMode = 0;

    /**
     * CommonReq ledom.
     * @member {string} ledom
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.ledom = "";

    /**
     * CommonReq diao.
     * @member {string} diao
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.diao = "";

    /**
     * CommonReq noisrevSo.
     * @member {string} noisrevSo
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.noisrevSo = "";

    /**
     * CommonReq dnarb.
     * @member {string} dnarb
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.dnarb = "";

    /**
     * CommonReq epytDnarb.
     * @member {string} epytDnarb
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.epytDnarb = "";

    /**
     * CommonReq wRcs.
     * @member {string} wRcs
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.wRcs = "";

    /**
     * CommonReq hRcs.
     * @member {string} hRcs
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.hRcs = "";

    /**
     * CommonReq pidRcs.
     * @member {string} pidRcs
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.pidRcs = "";

    /**
     * CommonReq needDecrypt.
     * @member {number} needDecrypt
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.needDecrypt = 0;

    /**
     * CommonReq needCamDecrypt.
     * @member {number} needCamDecrypt
     * @memberof CommonReq
     * @instance
     */
    CommonReq.prototype.needCamDecrypt = 0;

    /**
     * Creates a new CommonReq instance using the specified properties.
     * @function create
     * @memberof CommonReq
     * @static
     * @param {ICommonReq=} [properties] Properties to set
     * @returns {CommonReq} CommonReq instance
     */
    CommonReq.create = function create(properties) {
        return new CommonReq(properties);
    };

    /**
     * Encodes the specified CommonReq message. Does not implicitly {@link CommonReq.verify|verify} messages.
     * @function encode
     * @memberof CommonReq
     * @static
     * @param {ICommonReq} message CommonReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CommonReq.encode = function encode(message, writer) {
        if (!writer)
            writer = $Writer.create();
        if (message._clientType != null && Object.hasOwnProperty.call(message, "_clientType"))
            writer.uint32(/* id 1, wireType 0 =*/8).int32(message._clientType);
        if (message._clientVersion != null && Object.hasOwnProperty.call(message, "_clientVersion"))
            writer.uint32(/* id 2, wireType 2 =*/18).string(message._clientVersion);
        if (message._clientId != null && Object.hasOwnProperty.call(message, "_clientId"))
            writer.uint32(/* id 3, wireType 2 =*/26).string(message._clientId);
        if (message.apid != null && Object.hasOwnProperty.call(message, "apid"))
            writer.uint32(/* id 4, wireType 2 =*/34).string(message.apid);
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
        if (message.subappType != null && Object.hasOwnProperty.call(message, "subappType"))
            writer.uint32(/* id 13, wireType 2 =*/106).string(message.subappType);
        if (message._phoneNewimei != null && Object.hasOwnProperty.call(message, "_phoneNewimei"))
            writer.uint32(/* id 14, wireType 2 =*/114).string(message._phoneNewimei);
        if (message.ka != null && Object.hasOwnProperty.call(message, "ka"))
            writer.uint32(/* id 15, wireType 2 =*/122).string(message.ka);
        if (message.mApi != null && Object.hasOwnProperty.call(message, "mApi"))
            writer.uint32(/* id 16, wireType 2 =*/130).string(message.mApi);
        if (message.mLogid != null && Object.hasOwnProperty.call(message, "mLogid"))
            writer.uint32(/* id 17, wireType 2 =*/138).string(message.mLogid);
        if (message.mCost != null && Object.hasOwnProperty.call(message, "mCost"))
            writer.uint32(/* id 18, wireType 2 =*/146).string(message.mCost);
        if (message.mResult != null && Object.hasOwnProperty.call(message, "mResult"))
            writer.uint32(/* id 19, wireType 2 =*/154).string(message.mResult);
        if (message.mSizeU != null && Object.hasOwnProperty.call(message, "mSizeU"))
            writer.uint32(/* id 20, wireType 2 =*/162).string(message.mSizeU);
        if (message.mSizeD != null && Object.hasOwnProperty.call(message, "mSizeD"))
            writer.uint32(/* id 21, wireType 2 =*/170).string(message.mSizeD);
        if (message.smallflow != null && Object.hasOwnProperty.call(message, "smallflow"))
            writer.uint32(/* id 22, wireType 2 =*/178).string(message.smallflow);
        if (message.sign != null && Object.hasOwnProperty.call(message, "sign"))
            writer.uint32(/* id 23, wireType 2 =*/186).string(message.sign);
        if (message.pversion != null && Object.hasOwnProperty.call(message, "pversion"))
            writer.uint32(/* id 24, wireType 2 =*/194).string(message.pversion);
        if (message._osVersion != null && Object.hasOwnProperty.call(message, "_osVersion"))
            writer.uint32(/* id 25, wireType 2 =*/202).string(message._osVersion);
        if (message.brand != null && Object.hasOwnProperty.call(message, "brand"))
            writer.uint32(/* id 26, wireType 2 =*/210).string(message.brand);
        if (message.brandType != null && Object.hasOwnProperty.call(message, "brandType"))
            writer.uint32(/* id 27, wireType 2 =*/218).string(message.brandType);
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
        if (message.nawsGameVer != null && Object.hasOwnProperty.call(message, "nawsGameVer"))
            writer.uint32(/* id 44, wireType 2 =*/354).string(message.nawsGameVer);
        if (message.idfa != null && Object.hasOwnProperty.call(message, "idfa"))
            writer.uint32(/* id 45, wireType 2 =*/362).string(message.idfa);
        if (message.diac != null && Object.hasOwnProperty.call(message, "diac"))
            writer.uint32(/* id 46, wireType 2 =*/370).string(message.diac);
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
        if (message.shoubaiCuid != null && Object.hasOwnProperty.call(message, "shoubaiCuid"))
            writer.uint32(/* id 58, wireType 2 =*/466).string(message.shoubaiCuid);
        if (message.mac != null && Object.hasOwnProperty.call(message, "mac"))
            writer.uint32(/* id 59, wireType 2 =*/474).string(message.mac);
        if (message.idfv != null && Object.hasOwnProperty.call(message, "idfv"))
            writer.uint32(/* id 60, wireType 2 =*/482).string(message.idfv);
        if (message.extra != null && Object.hasOwnProperty.call(message, "extra"))
            writer.uint32(/* id 61, wireType 2 =*/490).string(message.extra);
        if (message.userAgent != null && Object.hasOwnProperty.call(message, "userAgent"))
            writer.uint32(/* id 62, wireType 2 =*/498).string(message.userAgent);
        if (message.personalizedRecSwitch != null && Object.hasOwnProperty.call(message, "personalizedRecSwitch"))
            writer.uint32(/* id 63, wireType 0 =*/504).int32(message.personalizedRecSwitch);
        if (message.iemi != null && Object.hasOwnProperty.call(message, "iemi"))
            writer.uint32(/* id 64, wireType 2 =*/514).string(message.iemi);
        if (message.iemiwen != null && Object.hasOwnProperty.call(message, "iemiwen"))
            writer.uint32(/* id 65, wireType 2 =*/522).string(message.iemiwen);
        if (message.cam != null && Object.hasOwnProperty.call(message, "cam"))
            writer.uint32(/* id 66, wireType 2 =*/530).string(message.cam);
        if (message.afdi != null && Object.hasOwnProperty.call(message, "afdi"))
            writer.uint32(/* id 67, wireType 2 =*/538).string(message.afdi);
        if (message.diDiordna != null && Object.hasOwnProperty.call(message, "diDiordna"))
            writer.uint32(/* id 68, wireType 2 =*/546).string(message.diDiordna);
        if (message.vfdi != null && Object.hasOwnProperty.call(message, "vfdi"))
            writer.uint32(/* id 69, wireType 2 =*/554).string(message.vfdi);
        if (message.deviceScore != null && Object.hasOwnProperty.call(message, "deviceScore"))
            writer.uint32(/* id 70, wireType 2 =*/562).string(message.deviceScore);
        if (message.pureMode != null && Object.hasOwnProperty.call(message, "pureMode"))
            writer.uint32(/* id 71, wireType 0 =*/568).int32(message.pureMode);
        if (message.xcxMode != null && Object.hasOwnProperty.call(message, "xcxMode"))
            writer.uint32(/* id 72, wireType 0 =*/576).int32(message.xcxMode);
        if (message.ledom != null && Object.hasOwnProperty.call(message, "ledom"))
            writer.uint32(/* id 73, wireType 2 =*/586).string(message.ledom);
        if (message.diao != null && Object.hasOwnProperty.call(message, "diao"))
            writer.uint32(/* id 74, wireType 2 =*/594).string(message.diao);
        if (message.noisrevSo != null && Object.hasOwnProperty.call(message, "noisrevSo"))
            writer.uint32(/* id 75, wireType 2 =*/602).string(message.noisrevSo);
        if (message.dnarb != null && Object.hasOwnProperty.call(message, "dnarb"))
            writer.uint32(/* id 76, wireType 2 =*/610).string(message.dnarb);
        if (message.epytDnarb != null && Object.hasOwnProperty.call(message, "epytDnarb"))
            writer.uint32(/* id 77, wireType 2 =*/618).string(message.epytDnarb);
        if (message.wRcs != null && Object.hasOwnProperty.call(message, "wRcs"))
            writer.uint32(/* id 78, wireType 2 =*/626).string(message.wRcs);
        if (message.hRcs != null && Object.hasOwnProperty.call(message, "hRcs"))
            writer.uint32(/* id 79, wireType 2 =*/634).string(message.hRcs);
        if (message.pidRcs != null && Object.hasOwnProperty.call(message, "pidRcs"))
            writer.uint32(/* id 80, wireType 2 =*/642).string(message.pidRcs);
        if (message.needDecrypt != null && Object.hasOwnProperty.call(message, "needDecrypt"))
            writer.uint32(/* id 81, wireType 0 =*/648).int32(message.needDecrypt);
        if (message.needCamDecrypt != null && Object.hasOwnProperty.call(message, "needCamDecrypt"))
            writer.uint32(/* id 82, wireType 0 =*/656).int32(message.needCamDecrypt);
        return writer;
    };

    /**
     * Encodes the specified CommonReq message, length delimited. Does not implicitly {@link CommonReq.verify|verify} messages.
     * @function encodeDelimited
     * @memberof CommonReq
     * @static
     * @param {ICommonReq} message CommonReq message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    CommonReq.encodeDelimited = function encodeDelimited(message, writer) {
        return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a CommonReq message from the specified reader or buffer.
     * @function decode
     * @memberof CommonReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {CommonReq} CommonReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CommonReq.decode = function decode(reader, length) {
        if (!(reader instanceof $Reader))
            reader = $Reader.create(reader);
        let end = length === undefined ? reader.len : reader.pos + length, message = new $root.CommonReq();
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
            case 4: {
                    message.apid = reader.string();
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
            case 13: {
                    message.subappType = reader.string();
                    break;
                }
            case 14: {
                    message._phoneNewimei = reader.string();
                    break;
                }
            case 15: {
                    message.ka = reader.string();
                    break;
                }
            case 16: {
                    message.mApi = reader.string();
                    break;
                }
            case 17: {
                    message.mLogid = reader.string();
                    break;
                }
            case 18: {
                    message.mCost = reader.string();
                    break;
                }
            case 19: {
                    message.mResult = reader.string();
                    break;
                }
            case 20: {
                    message.mSizeU = reader.string();
                    break;
                }
            case 21: {
                    message.mSizeD = reader.string();
                    break;
                }
            case 22: {
                    message.smallflow = reader.string();
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
            case 27: {
                    message.brandType = reader.string();
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
                    message.nawsGameVer = reader.string();
                    break;
                }
            case 45: {
                    message.idfa = reader.string();
                    break;
                }
            case 46: {
                    message.diac = reader.string();
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
            case 58: {
                    message.shoubaiCuid = reader.string();
                    break;
                }
            case 59: {
                    message.mac = reader.string();
                    break;
                }
            case 60: {
                    message.idfv = reader.string();
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
            case 64: {
                    message.iemi = reader.string();
                    break;
                }
            case 65: {
                    message.iemiwen = reader.string();
                    break;
                }
            case 66: {
                    message.cam = reader.string();
                    break;
                }
            case 67: {
                    message.afdi = reader.string();
                    break;
                }
            case 68: {
                    message.diDiordna = reader.string();
                    break;
                }
            case 69: {
                    message.vfdi = reader.string();
                    break;
                }
            case 70: {
                    message.deviceScore = reader.string();
                    break;
                }
            case 71: {
                    message.pureMode = reader.int32();
                    break;
                }
            case 72: {
                    message.xcxMode = reader.int32();
                    break;
                }
            case 73: {
                    message.ledom = reader.string();
                    break;
                }
            case 74: {
                    message.diao = reader.string();
                    break;
                }
            case 75: {
                    message.noisrevSo = reader.string();
                    break;
                }
            case 76: {
                    message.dnarb = reader.string();
                    break;
                }
            case 77: {
                    message.epytDnarb = reader.string();
                    break;
                }
            case 78: {
                    message.wRcs = reader.string();
                    break;
                }
            case 79: {
                    message.hRcs = reader.string();
                    break;
                }
            case 80: {
                    message.pidRcs = reader.string();
                    break;
                }
            case 81: {
                    message.needDecrypt = reader.int32();
                    break;
                }
            case 82: {
                    message.needCamDecrypt = reader.int32();
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
     * Decodes a CommonReq message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof CommonReq
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {CommonReq} CommonReq
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    CommonReq.decodeDelimited = function decodeDelimited(reader) {
        if (!(reader instanceof $Reader))
            reader = new $Reader(reader);
        return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a CommonReq message.
     * @function verify
     * @memberof CommonReq
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    CommonReq.verify = function verify(message) {
        if (typeof message !== "object" || message === null)
            return "object expected";
        if (message._clientType != null && message.hasOwnProperty("_clientType"))
            if (!$util.isInteger(message._clientType))
                return "_clientType: integer expected";
        if (message._clientVersion != null && message.hasOwnProperty("_clientVersion"))
            if (!$util.isString(message._clientVersion))
                return "_clientVersion: string expected";
        if (message._clientId != null && message.hasOwnProperty("_clientId"))
            if (!$util.isString(message._clientId))
                return "_clientId: string expected";
        if (message.apid != null && message.hasOwnProperty("apid"))
            if (!$util.isString(message.apid))
                return "apid: string expected";
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
        if (message.BDUSS != null && message.hasOwnProperty("BDUSS"))
            if (!$util.isString(message.BDUSS))
                return "BDUSS: string expected";
        if (message.tbs != null && message.hasOwnProperty("tbs"))
            if (!$util.isString(message.tbs))
                return "tbs: string expected";
        if (message.netType != null && message.hasOwnProperty("netType"))
            if (!$util.isInteger(message.netType))
                return "netType: integer expected";
        if (message.subappType != null && message.hasOwnProperty("subappType"))
            if (!$util.isString(message.subappType))
                return "subappType: string expected";
        if (message._phoneNewimei != null && message.hasOwnProperty("_phoneNewimei"))
            if (!$util.isString(message._phoneNewimei))
                return "_phoneNewimei: string expected";
        if (message.ka != null && message.hasOwnProperty("ka"))
            if (!$util.isString(message.ka))
                return "ka: string expected";
        if (message.mApi != null && message.hasOwnProperty("mApi"))
            if (!$util.isString(message.mApi))
                return "mApi: string expected";
        if (message.mLogid != null && message.hasOwnProperty("mLogid"))
            if (!$util.isString(message.mLogid))
                return "mLogid: string expected";
        if (message.mCost != null && message.hasOwnProperty("mCost"))
            if (!$util.isString(message.mCost))
                return "mCost: string expected";
        if (message.mResult != null && message.hasOwnProperty("mResult"))
            if (!$util.isString(message.mResult))
                return "mResult: string expected";
        if (message.mSizeU != null && message.hasOwnProperty("mSizeU"))
            if (!$util.isString(message.mSizeU))
                return "mSizeU: string expected";
        if (message.mSizeD != null && message.hasOwnProperty("mSizeD"))
            if (!$util.isString(message.mSizeD))
                return "mSizeD: string expected";
        if (message.smallflow != null && message.hasOwnProperty("smallflow"))
            if (!$util.isString(message.smallflow))
                return "smallflow: string expected";
        if (message.sign != null && message.hasOwnProperty("sign"))
            if (!$util.isString(message.sign))
                return "sign: string expected";
        if (message.pversion != null && message.hasOwnProperty("pversion"))
            if (!$util.isString(message.pversion))
                return "pversion: string expected";
        if (message._osVersion != null && message.hasOwnProperty("_osVersion"))
            if (!$util.isString(message._osVersion))
                return "_osVersion: string expected";
        if (message.brand != null && message.hasOwnProperty("brand"))
            if (!$util.isString(message.brand))
                return "brand: string expected";
        if (message.brandType != null && message.hasOwnProperty("brandType"))
            if (!$util.isString(message.brandType))
                return "brandType: string expected";
        if (message.legoLibVersion != null && message.hasOwnProperty("legoLibVersion"))
            if (!$util.isString(message.legoLibVersion))
                return "legoLibVersion: string expected";
        if (message.applist != null && message.hasOwnProperty("applist"))
            if (!$util.isString(message.applist))
                return "applist: string expected";
        if (message.stoken != null && message.hasOwnProperty("stoken"))
            if (!$util.isString(message.stoken))
                return "stoken: string expected";
        if (message.zId != null && message.hasOwnProperty("zId"))
            if (!$util.isString(message.zId))
                return "zId: string expected";
        if (message.cuidGalaxy2 != null && message.hasOwnProperty("cuidGalaxy2"))
            if (!$util.isString(message.cuidGalaxy2))
                return "cuidGalaxy2: string expected";
        if (message.cuidGid != null && message.hasOwnProperty("cuidGid"))
            if (!$util.isString(message.cuidGid))
                return "cuidGid: string expected";
        if (message.oaid != null && message.hasOwnProperty("oaid"))
            if (!$util.isString(message.oaid))
                return "oaid: string expected";
        if (message.c3Aid != null && message.hasOwnProperty("c3Aid"))
            if (!$util.isString(message.c3Aid))
                return "c3Aid: string expected";
        if (message.sampleId != null && message.hasOwnProperty("sampleId"))
            if (!$util.isString(message.sampleId))
                return "sampleId: string expected";
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
        if (message.isTeenager != null && message.hasOwnProperty("isTeenager"))
            if (!$util.isInteger(message.isTeenager))
                return "isTeenager: integer expected";
        if (message.sdkVer != null && message.hasOwnProperty("sdkVer"))
            if (!$util.isString(message.sdkVer))
                return "sdkVer: string expected";
        if (message.frameworkVer != null && message.hasOwnProperty("frameworkVer"))
            if (!$util.isString(message.frameworkVer))
                return "frameworkVer: string expected";
        if (message.nawsGameVer != null && message.hasOwnProperty("nawsGameVer"))
            if (!$util.isString(message.nawsGameVer))
                return "nawsGameVer: string expected";
        if (message.idfa != null && message.hasOwnProperty("idfa"))
            if (!$util.isString(message.idfa))
                return "idfa: string expected";
        if (message.diac != null && message.hasOwnProperty("diac"))
            if (!$util.isString(message.diac))
                return "diac: string expected";
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
        if (message.startScheme != null && message.hasOwnProperty("startScheme"))
            if (!$util.isString(message.startScheme))
                return "startScheme: string expected";
        if (message.startType != null && message.hasOwnProperty("startType"))
            if (!$util.isInteger(message.startType))
                return "startType: integer expected";
        if (message.shoubaiCuid != null && message.hasOwnProperty("shoubaiCuid"))
            if (!$util.isString(message.shoubaiCuid))
                return "shoubaiCuid: string expected";
        if (message.mac != null && message.hasOwnProperty("mac"))
            if (!$util.isString(message.mac))
                return "mac: string expected";
        if (message.idfv != null && message.hasOwnProperty("idfv"))
            if (!$util.isString(message.idfv))
                return "idfv: string expected";
        if (message.extra != null && message.hasOwnProperty("extra"))
            if (!$util.isString(message.extra))
                return "extra: string expected";
        if (message.userAgent != null && message.hasOwnProperty("userAgent"))
            if (!$util.isString(message.userAgent))
                return "userAgent: string expected";
        if (message.personalizedRecSwitch != null && message.hasOwnProperty("personalizedRecSwitch"))
            if (!$util.isInteger(message.personalizedRecSwitch))
                return "personalizedRecSwitch: integer expected";
        if (message.iemi != null && message.hasOwnProperty("iemi"))
            if (!$util.isString(message.iemi))
                return "iemi: string expected";
        if (message.iemiwen != null && message.hasOwnProperty("iemiwen"))
            if (!$util.isString(message.iemiwen))
                return "iemiwen: string expected";
        if (message.cam != null && message.hasOwnProperty("cam"))
            if (!$util.isString(message.cam))
                return "cam: string expected";
        if (message.afdi != null && message.hasOwnProperty("afdi"))
            if (!$util.isString(message.afdi))
                return "afdi: string expected";
        if (message.diDiordna != null && message.hasOwnProperty("diDiordna"))
            if (!$util.isString(message.diDiordna))
                return "diDiordna: string expected";
        if (message.vfdi != null && message.hasOwnProperty("vfdi"))
            if (!$util.isString(message.vfdi))
                return "vfdi: string expected";
        if (message.deviceScore != null && message.hasOwnProperty("deviceScore"))
            if (!$util.isString(message.deviceScore))
                return "deviceScore: string expected";
        if (message.pureMode != null && message.hasOwnProperty("pureMode"))
            if (!$util.isInteger(message.pureMode))
                return "pureMode: integer expected";
        if (message.xcxMode != null && message.hasOwnProperty("xcxMode"))
            if (!$util.isInteger(message.xcxMode))
                return "xcxMode: integer expected";
        if (message.ledom != null && message.hasOwnProperty("ledom"))
            if (!$util.isString(message.ledom))
                return "ledom: string expected";
        if (message.diao != null && message.hasOwnProperty("diao"))
            if (!$util.isString(message.diao))
                return "diao: string expected";
        if (message.noisrevSo != null && message.hasOwnProperty("noisrevSo"))
            if (!$util.isString(message.noisrevSo))
                return "noisrevSo: string expected";
        if (message.dnarb != null && message.hasOwnProperty("dnarb"))
            if (!$util.isString(message.dnarb))
                return "dnarb: string expected";
        if (message.epytDnarb != null && message.hasOwnProperty("epytDnarb"))
            if (!$util.isString(message.epytDnarb))
                return "epytDnarb: string expected";
        if (message.wRcs != null && message.hasOwnProperty("wRcs"))
            if (!$util.isString(message.wRcs))
                return "wRcs: string expected";
        if (message.hRcs != null && message.hasOwnProperty("hRcs"))
            if (!$util.isString(message.hRcs))
                return "hRcs: string expected";
        if (message.pidRcs != null && message.hasOwnProperty("pidRcs"))
            if (!$util.isString(message.pidRcs))
                return "pidRcs: string expected";
        if (message.needDecrypt != null && message.hasOwnProperty("needDecrypt"))
            if (!$util.isInteger(message.needDecrypt))
                return "needDecrypt: integer expected";
        if (message.needCamDecrypt != null && message.hasOwnProperty("needCamDecrypt"))
            if (!$util.isInteger(message.needCamDecrypt))
                return "needCamDecrypt: integer expected";
        return null;
    };

    /**
     * Creates a CommonReq message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof CommonReq
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {CommonReq} CommonReq
     */
    CommonReq.fromObject = function fromObject(object) {
        if (object instanceof $root.CommonReq)
            return object;
        let message = new $root.CommonReq();
        if (object._clientType != null)
            message._clientType = object._clientType | 0;
        if (object._clientVersion != null)
            message._clientVersion = String(object._clientVersion);
        if (object._clientId != null)
            message._clientId = String(object._clientId);
        if (object.apid != null)
            message.apid = String(object.apid);
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
        if (object.subappType != null)
            message.subappType = String(object.subappType);
        if (object._phoneNewimei != null)
            message._phoneNewimei = String(object._phoneNewimei);
        if (object.ka != null)
            message.ka = String(object.ka);
        if (object.mApi != null)
            message.mApi = String(object.mApi);
        if (object.mLogid != null)
            message.mLogid = String(object.mLogid);
        if (object.mCost != null)
            message.mCost = String(object.mCost);
        if (object.mResult != null)
            message.mResult = String(object.mResult);
        if (object.mSizeU != null)
            message.mSizeU = String(object.mSizeU);
        if (object.mSizeD != null)
            message.mSizeD = String(object.mSizeD);
        if (object.smallflow != null)
            message.smallflow = String(object.smallflow);
        if (object.sign != null)
            message.sign = String(object.sign);
        if (object.pversion != null)
            message.pversion = String(object.pversion);
        if (object._osVersion != null)
            message._osVersion = String(object._osVersion);
        if (object.brand != null)
            message.brand = String(object.brand);
        if (object.brandType != null)
            message.brandType = String(object.brandType);
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
        if (object.nawsGameVer != null)
            message.nawsGameVer = String(object.nawsGameVer);
        if (object.idfa != null)
            message.idfa = String(object.idfa);
        if (object.diac != null)
            message.diac = String(object.diac);
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
        if (object.shoubaiCuid != null)
            message.shoubaiCuid = String(object.shoubaiCuid);
        if (object.mac != null)
            message.mac = String(object.mac);
        if (object.idfv != null)
            message.idfv = String(object.idfv);
        if (object.extra != null)
            message.extra = String(object.extra);
        if (object.userAgent != null)
            message.userAgent = String(object.userAgent);
        if (object.personalizedRecSwitch != null)
            message.personalizedRecSwitch = object.personalizedRecSwitch | 0;
        if (object.iemi != null)
            message.iemi = String(object.iemi);
        if (object.iemiwen != null)
            message.iemiwen = String(object.iemiwen);
        if (object.cam != null)
            message.cam = String(object.cam);
        if (object.afdi != null)
            message.afdi = String(object.afdi);
        if (object.diDiordna != null)
            message.diDiordna = String(object.diDiordna);
        if (object.vfdi != null)
            message.vfdi = String(object.vfdi);
        if (object.deviceScore != null)
            message.deviceScore = String(object.deviceScore);
        if (object.pureMode != null)
            message.pureMode = object.pureMode | 0;
        if (object.xcxMode != null)
            message.xcxMode = object.xcxMode | 0;
        if (object.ledom != null)
            message.ledom = String(object.ledom);
        if (object.diao != null)
            message.diao = String(object.diao);
        if (object.noisrevSo != null)
            message.noisrevSo = String(object.noisrevSo);
        if (object.dnarb != null)
            message.dnarb = String(object.dnarb);
        if (object.epytDnarb != null)
            message.epytDnarb = String(object.epytDnarb);
        if (object.wRcs != null)
            message.wRcs = String(object.wRcs);
        if (object.hRcs != null)
            message.hRcs = String(object.hRcs);
        if (object.pidRcs != null)
            message.pidRcs = String(object.pidRcs);
        if (object.needDecrypt != null)
            message.needDecrypt = object.needDecrypt | 0;
        if (object.needCamDecrypt != null)
            message.needCamDecrypt = object.needCamDecrypt | 0;
        return message;
    };

    /**
     * Creates a plain object from a CommonReq message. Also converts values to other types if specified.
     * @function toObject
     * @memberof CommonReq
     * @static
     * @param {CommonReq} message CommonReq
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    CommonReq.toObject = function toObject(message, options) {
        if (!options)
            options = {};
        let object = {};
        if (options.defaults) {
            object._clientType = 0;
            object._clientVersion = "";
            object._clientId = "";
            object.apid = "";
            object._phoneImei = "";
            object.from = "";
            object.cuid = "";
            if ($util.Long) {
                let long = new $util.Long(0, 0, false);
                object._timestamp = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
            } else
                object._timestamp = options.longs === String ? "0" : 0;
            object.model = "";
            object.BDUSS = "";
            object.tbs = "";
            object.netType = 0;
            object.subappType = "";
            object._phoneNewimei = "";
            object.ka = "";
            object.mApi = "";
            object.mLogid = "";
            object.mCost = "";
            object.mResult = "";
            object.mSizeU = "";
            object.mSizeD = "";
            object.smallflow = "";
            object.sign = "";
            object.pversion = "";
            object._osVersion = "";
            object.brand = "";
            object.brandType = "";
            object.legoLibVersion = "";
            object.applist = "";
            object.stoken = "";
            object.zId = "";
            object.cuidGalaxy2 = "";
            object.cuidGid = "";
            object.oaid = "";
            object.c3Aid = "";
            object.sampleId = "";
            object.scrW = 0;
            object.scrH = 0;
            object.scrDip = 0;
            object.qType = 0;
            object.isTeenager = 0;
            object.sdkVer = "";
            object.frameworkVer = "";
            object.nawsGameVer = "";
            object.idfa = "";
            object.diac = "";
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
            object.startScheme = "";
            object.startType = 0;
            object.shoubaiCuid = "";
            object.mac = "";
            object.idfv = "";
            object.extra = "";
            object.userAgent = "";
            object.personalizedRecSwitch = 0;
            object.iemi = "";
            object.iemiwen = "";
            object.cam = "";
            object.afdi = "";
            object.diDiordna = "";
            object.vfdi = "";
            object.deviceScore = "";
            object.pureMode = 0;
            object.xcxMode = 0;
            object.ledom = "";
            object.diao = "";
            object.noisrevSo = "";
            object.dnarb = "";
            object.epytDnarb = "";
            object.wRcs = "";
            object.hRcs = "";
            object.pidRcs = "";
            object.needDecrypt = 0;
            object.needCamDecrypt = 0;
        }
        if (message._clientType != null && message.hasOwnProperty("_clientType"))
            object._clientType = message._clientType;
        if (message._clientVersion != null && message.hasOwnProperty("_clientVersion"))
            object._clientVersion = message._clientVersion;
        if (message._clientId != null && message.hasOwnProperty("_clientId"))
            object._clientId = message._clientId;
        if (message.apid != null && message.hasOwnProperty("apid"))
            object.apid = message.apid;
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
        if (message.BDUSS != null && message.hasOwnProperty("BDUSS"))
            object.BDUSS = message.BDUSS;
        if (message.tbs != null && message.hasOwnProperty("tbs"))
            object.tbs = message.tbs;
        if (message.netType != null && message.hasOwnProperty("netType"))
            object.netType = message.netType;
        if (message.subappType != null && message.hasOwnProperty("subappType"))
            object.subappType = message.subappType;
        if (message._phoneNewimei != null && message.hasOwnProperty("_phoneNewimei"))
            object._phoneNewimei = message._phoneNewimei;
        if (message.ka != null && message.hasOwnProperty("ka"))
            object.ka = message.ka;
        if (message.mApi != null && message.hasOwnProperty("mApi"))
            object.mApi = message.mApi;
        if (message.mLogid != null && message.hasOwnProperty("mLogid"))
            object.mLogid = message.mLogid;
        if (message.mCost != null && message.hasOwnProperty("mCost"))
            object.mCost = message.mCost;
        if (message.mResult != null && message.hasOwnProperty("mResult"))
            object.mResult = message.mResult;
        if (message.mSizeU != null && message.hasOwnProperty("mSizeU"))
            object.mSizeU = message.mSizeU;
        if (message.mSizeD != null && message.hasOwnProperty("mSizeD"))
            object.mSizeD = message.mSizeD;
        if (message.smallflow != null && message.hasOwnProperty("smallflow"))
            object.smallflow = message.smallflow;
        if (message.sign != null && message.hasOwnProperty("sign"))
            object.sign = message.sign;
        if (message.pversion != null && message.hasOwnProperty("pversion"))
            object.pversion = message.pversion;
        if (message._osVersion != null && message.hasOwnProperty("_osVersion"))
            object._osVersion = message._osVersion;
        if (message.brand != null && message.hasOwnProperty("brand"))
            object.brand = message.brand;
        if (message.brandType != null && message.hasOwnProperty("brandType"))
            object.brandType = message.brandType;
        if (message.legoLibVersion != null && message.hasOwnProperty("legoLibVersion"))
            object.legoLibVersion = message.legoLibVersion;
        if (message.applist != null && message.hasOwnProperty("applist"))
            object.applist = message.applist;
        if (message.stoken != null && message.hasOwnProperty("stoken"))
            object.stoken = message.stoken;
        if (message.zId != null && message.hasOwnProperty("zId"))
            object.zId = message.zId;
        if (message.cuidGalaxy2 != null && message.hasOwnProperty("cuidGalaxy2"))
            object.cuidGalaxy2 = message.cuidGalaxy2;
        if (message.cuidGid != null && message.hasOwnProperty("cuidGid"))
            object.cuidGid = message.cuidGid;
        if (message.oaid != null && message.hasOwnProperty("oaid"))
            object.oaid = message.oaid;
        if (message.c3Aid != null && message.hasOwnProperty("c3Aid"))
            object.c3Aid = message.c3Aid;
        if (message.sampleId != null && message.hasOwnProperty("sampleId"))
            object.sampleId = message.sampleId;
        if (message.scrW != null && message.hasOwnProperty("scrW"))
            object.scrW = message.scrW;
        if (message.scrH != null && message.hasOwnProperty("scrH"))
            object.scrH = message.scrH;
        if (message.scrDip != null && message.hasOwnProperty("scrDip"))
            object.scrDip = options.json && !isFinite(message.scrDip) ? String(message.scrDip) : message.scrDip;
        if (message.qType != null && message.hasOwnProperty("qType"))
            object.qType = message.qType;
        if (message.isTeenager != null && message.hasOwnProperty("isTeenager"))
            object.isTeenager = message.isTeenager;
        if (message.sdkVer != null && message.hasOwnProperty("sdkVer"))
            object.sdkVer = message.sdkVer;
        if (message.frameworkVer != null && message.hasOwnProperty("frameworkVer"))
            object.frameworkVer = message.frameworkVer;
        if (message.nawsGameVer != null && message.hasOwnProperty("nawsGameVer"))
            object.nawsGameVer = message.nawsGameVer;
        if (message.idfa != null && message.hasOwnProperty("idfa"))
            object.idfa = message.idfa;
        if (message.diac != null && message.hasOwnProperty("diac"))
            object.diac = message.diac;
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
        if (message.startScheme != null && message.hasOwnProperty("startScheme"))
            object.startScheme = message.startScheme;
        if (message.startType != null && message.hasOwnProperty("startType"))
            object.startType = message.startType;
        if (message.shoubaiCuid != null && message.hasOwnProperty("shoubaiCuid"))
            object.shoubaiCuid = message.shoubaiCuid;
        if (message.mac != null && message.hasOwnProperty("mac"))
            object.mac = message.mac;
        if (message.idfv != null && message.hasOwnProperty("idfv"))
            object.idfv = message.idfv;
        if (message.extra != null && message.hasOwnProperty("extra"))
            object.extra = message.extra;
        if (message.userAgent != null && message.hasOwnProperty("userAgent"))
            object.userAgent = message.userAgent;
        if (message.personalizedRecSwitch != null && message.hasOwnProperty("personalizedRecSwitch"))
            object.personalizedRecSwitch = message.personalizedRecSwitch;
        if (message.iemi != null && message.hasOwnProperty("iemi"))
            object.iemi = message.iemi;
        if (message.iemiwen != null && message.hasOwnProperty("iemiwen"))
            object.iemiwen = message.iemiwen;
        if (message.cam != null && message.hasOwnProperty("cam"))
            object.cam = message.cam;
        if (message.afdi != null && message.hasOwnProperty("afdi"))
            object.afdi = message.afdi;
        if (message.diDiordna != null && message.hasOwnProperty("diDiordna"))
            object.diDiordna = message.diDiordna;
        if (message.vfdi != null && message.hasOwnProperty("vfdi"))
            object.vfdi = message.vfdi;
        if (message.deviceScore != null && message.hasOwnProperty("deviceScore"))
            object.deviceScore = message.deviceScore;
        if (message.pureMode != null && message.hasOwnProperty("pureMode"))
            object.pureMode = message.pureMode;
        if (message.xcxMode != null && message.hasOwnProperty("xcxMode"))
            object.xcxMode = message.xcxMode;
        if (message.ledom != null && message.hasOwnProperty("ledom"))
            object.ledom = message.ledom;
        if (message.diao != null && message.hasOwnProperty("diao"))
            object.diao = message.diao;
        if (message.noisrevSo != null && message.hasOwnProperty("noisrevSo"))
            object.noisrevSo = message.noisrevSo;
        if (message.dnarb != null && message.hasOwnProperty("dnarb"))
            object.dnarb = message.dnarb;
        if (message.epytDnarb != null && message.hasOwnProperty("epytDnarb"))
            object.epytDnarb = message.epytDnarb;
        if (message.wRcs != null && message.hasOwnProperty("wRcs"))
            object.wRcs = message.wRcs;
        if (message.hRcs != null && message.hasOwnProperty("hRcs"))
            object.hRcs = message.hRcs;
        if (message.pidRcs != null && message.hasOwnProperty("pidRcs"))
            object.pidRcs = message.pidRcs;
        if (message.needDecrypt != null && message.hasOwnProperty("needDecrypt"))
            object.needDecrypt = message.needDecrypt;
        if (message.needCamDecrypt != null && message.hasOwnProperty("needCamDecrypt"))
            object.needCamDecrypt = message.needCamDecrypt;
        return object;
    };

    /**
     * Converts this CommonReq to JSON.
     * @function toJSON
     * @memberof CommonReq
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    CommonReq.prototype.toJSON = function toJSON() {
        return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for CommonReq
     * @function getTypeUrl
     * @memberof CommonReq
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    CommonReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
        if (typeUrlPrefix === undefined) {
            typeUrlPrefix = "type.googleapis.com";
        }
        return typeUrlPrefix + "/CommonReq";
    };

    return CommonReq;
})();

export { $root as default };
