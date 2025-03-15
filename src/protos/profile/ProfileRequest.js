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

    tieba.profile = (function() {

        /**
         * Namespace profile.
         * @memberof tieba
         * @namespace
         */
        const profile = {};

        profile.ProfileRequest = (function() {

            /**
             * Properties of a ProfileRequest.
             * @memberof tieba.profile
             * @interface IProfileRequest
             * @property {tieba.profile.IProfileRequestData|null} [data] ProfileRequest data
             */

            /**
             * Constructs a new ProfileRequest.
             * @memberof tieba.profile
             * @classdesc Represents a ProfileRequest.
             * @implements IProfileRequest
             * @constructor
             * @param {tieba.profile.IProfileRequest=} [properties] Properties to set
             */
            function ProfileRequest(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ProfileRequest data.
             * @member {tieba.profile.IProfileRequestData|null|undefined} data
             * @memberof tieba.profile.ProfileRequest
             * @instance
             */
            ProfileRequest.prototype.data = null;

            /**
             * Creates a new ProfileRequest instance using the specified properties.
             * @function create
             * @memberof tieba.profile.ProfileRequest
             * @static
             * @param {tieba.profile.IProfileRequest=} [properties] Properties to set
             * @returns {tieba.profile.ProfileRequest} ProfileRequest instance
             */
            ProfileRequest.create = function create(properties) {
                return new ProfileRequest(properties);
            };

            /**
             * Encodes the specified ProfileRequest message. Does not implicitly {@link tieba.profile.ProfileRequest.verify|verify} messages.
             * @function encode
             * @memberof tieba.profile.ProfileRequest
             * @static
             * @param {tieba.profile.IProfileRequest} message ProfileRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ProfileRequest.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.data != null && Object.hasOwnProperty.call(message, "data"))
                    $root.tieba.profile.ProfileRequestData.encode(message.data, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
                return writer;
            };

            /**
             * Encodes the specified ProfileRequest message, length delimited. Does not implicitly {@link tieba.profile.ProfileRequest.verify|verify} messages.
             * @function encodeDelimited
             * @memberof tieba.profile.ProfileRequest
             * @static
             * @param {tieba.profile.IProfileRequest} message ProfileRequest message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ProfileRequest.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ProfileRequest message from the specified reader or buffer.
             * @function decode
             * @memberof tieba.profile.ProfileRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {tieba.profile.ProfileRequest} ProfileRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ProfileRequest.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.tieba.profile.ProfileRequest();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.data = $root.tieba.profile.ProfileRequestData.decode(reader, reader.uint32());
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
             * Decodes a ProfileRequest message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof tieba.profile.ProfileRequest
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {tieba.profile.ProfileRequest} ProfileRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ProfileRequest.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ProfileRequest message.
             * @function verify
             * @memberof tieba.profile.ProfileRequest
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ProfileRequest.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                if (message.data != null && message.hasOwnProperty("data")) {
                    let error = $root.tieba.profile.ProfileRequestData.verify(message.data);
                    if (error)
                        return "data." + error;
                }
                return null;
            };

            /**
             * Creates a ProfileRequest message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof tieba.profile.ProfileRequest
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {tieba.profile.ProfileRequest} ProfileRequest
             */
            ProfileRequest.fromObject = function fromObject(object) {
                if (object instanceof $root.tieba.profile.ProfileRequest)
                    return object;
                let message = new $root.tieba.profile.ProfileRequest();
                if (object.data != null) {
                    if (typeof object.data !== "object")
                        throw TypeError(".tieba.profile.ProfileRequest.data: object expected");
                    message.data = $root.tieba.profile.ProfileRequestData.fromObject(object.data);
                }
                return message;
            };

            /**
             * Creates a plain object from a ProfileRequest message. Also converts values to other types if specified.
             * @function toObject
             * @memberof tieba.profile.ProfileRequest
             * @static
             * @param {tieba.profile.ProfileRequest} message ProfileRequest
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ProfileRequest.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults)
                    object.data = null;
                if (message.data != null && message.hasOwnProperty("data"))
                    object.data = $root.tieba.profile.ProfileRequestData.toObject(message.data, options);
                return object;
            };

            /**
             * Converts this ProfileRequest to JSON.
             * @function toJSON
             * @memberof tieba.profile.ProfileRequest
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ProfileRequest.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ProfileRequest
             * @function getTypeUrl
             * @memberof tieba.profile.ProfileRequest
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ProfileRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/tieba.profile.ProfileRequest";
            };

            return ProfileRequest;
        })();

        profile.ProfileRequestData = (function() {

            /**
             * Properties of a ProfileRequestData.
             * @memberof tieba.profile
             * @interface IProfileRequestData
             * @property {number|Long|null} [uid] ProfileRequestData uid
             * @property {number|null} [needPostCount] ProfileRequestData needPostCount
             * @property {number|Long|null} [friendUid] ProfileRequestData friendUid
             * @property {number|null} [isGuest] ProfileRequestData isGuest
             * @property {string|null} [stType] ProfileRequestData stType
             * @property {number|null} [pn] ProfileRequestData pn
             * @property {number|null} [rn] ProfileRequestData rn
             * @property {number|null} [hasPlist] ProfileRequestData hasPlist
             * @property {tieba.ICommonRequest|null} [common] ProfileRequestData common
             * @property {number|null} [scrW] ProfileRequestData scrW
             * @property {number|null} [scrH] ProfileRequestData scrH
             * @property {number|null} [qType] ProfileRequestData qType
             * @property {number|null} [scrDip] ProfileRequestData scrDip
             * @property {number|null} [isFromUsercenter] ProfileRequestData isFromUsercenter
             * @property {number|null} [page] ProfileRequestData page
             * @property {string|null} [friendUidPortrait] ProfileRequestData friendUidPortrait
             * @property {string|null} [historyForumIds] ProfileRequestData historyForumIds
             * @property {string|null} [historyForumNames] ProfileRequestData historyForumNames
             * @property {number|null} [needUsergrowthTask] ProfileRequestData needUsergrowthTask
             */

            /**
             * Constructs a new ProfileRequestData.
             * @memberof tieba.profile
             * @classdesc Represents a ProfileRequestData.
             * @implements IProfileRequestData
             * @constructor
             * @param {tieba.profile.IProfileRequestData=} [properties] Properties to set
             */
            function ProfileRequestData(properties) {
                if (properties)
                    for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                        if (properties[keys[i]] != null)
                            this[keys[i]] = properties[keys[i]];
            }

            /**
             * ProfileRequestData uid.
             * @member {number|Long|null|undefined} uid
             * @memberof tieba.profile.ProfileRequestData
             * @instance
             */
            ProfileRequestData.prototype.uid = null;

            /**
             * ProfileRequestData needPostCount.
             * @member {number} needPostCount
             * @memberof tieba.profile.ProfileRequestData
             * @instance
             */
            ProfileRequestData.prototype.needPostCount = 0;

            /**
             * ProfileRequestData friendUid.
             * @member {number|Long|null|undefined} friendUid
             * @memberof tieba.profile.ProfileRequestData
             * @instance
             */
            ProfileRequestData.prototype.friendUid = null;

            /**
             * ProfileRequestData isGuest.
             * @member {number} isGuest
             * @memberof tieba.profile.ProfileRequestData
             * @instance
             */
            ProfileRequestData.prototype.isGuest = 0;

            /**
             * ProfileRequestData stType.
             * @member {string} stType
             * @memberof tieba.profile.ProfileRequestData
             * @instance
             */
            ProfileRequestData.prototype.stType = "";

            /**
             * ProfileRequestData pn.
             * @member {number} pn
             * @memberof tieba.profile.ProfileRequestData
             * @instance
             */
            ProfileRequestData.prototype.pn = 0;

            /**
             * ProfileRequestData rn.
             * @member {number} rn
             * @memberof tieba.profile.ProfileRequestData
             * @instance
             */
            ProfileRequestData.prototype.rn = 0;

            /**
             * ProfileRequestData hasPlist.
             * @member {number} hasPlist
             * @memberof tieba.profile.ProfileRequestData
             * @instance
             */
            ProfileRequestData.prototype.hasPlist = 0;

            /**
             * ProfileRequestData common.
             * @member {tieba.ICommonRequest|null|undefined} common
             * @memberof tieba.profile.ProfileRequestData
             * @instance
             */
            ProfileRequestData.prototype.common = null;

            /**
             * ProfileRequestData scrW.
             * @member {number} scrW
             * @memberof tieba.profile.ProfileRequestData
             * @instance
             */
            ProfileRequestData.prototype.scrW = 0;

            /**
             * ProfileRequestData scrH.
             * @member {number} scrH
             * @memberof tieba.profile.ProfileRequestData
             * @instance
             */
            ProfileRequestData.prototype.scrH = 0;

            /**
             * ProfileRequestData qType.
             * @member {number} qType
             * @memberof tieba.profile.ProfileRequestData
             * @instance
             */
            ProfileRequestData.prototype.qType = 0;

            /**
             * ProfileRequestData scrDip.
             * @member {number} scrDip
             * @memberof tieba.profile.ProfileRequestData
             * @instance
             */
            ProfileRequestData.prototype.scrDip = 0;

            /**
             * ProfileRequestData isFromUsercenter.
             * @member {number} isFromUsercenter
             * @memberof tieba.profile.ProfileRequestData
             * @instance
             */
            ProfileRequestData.prototype.isFromUsercenter = 0;

            /**
             * ProfileRequestData page.
             * @member {number} page
             * @memberof tieba.profile.ProfileRequestData
             * @instance
             */
            ProfileRequestData.prototype.page = 0;

            /**
             * ProfileRequestData friendUidPortrait.
             * @member {string} friendUidPortrait
             * @memberof tieba.profile.ProfileRequestData
             * @instance
             */
            ProfileRequestData.prototype.friendUidPortrait = "";

            /**
             * ProfileRequestData historyForumIds.
             * @member {string} historyForumIds
             * @memberof tieba.profile.ProfileRequestData
             * @instance
             */
            ProfileRequestData.prototype.historyForumIds = "";

            /**
             * ProfileRequestData historyForumNames.
             * @member {string} historyForumNames
             * @memberof tieba.profile.ProfileRequestData
             * @instance
             */
            ProfileRequestData.prototype.historyForumNames = "";

            /**
             * ProfileRequestData needUsergrowthTask.
             * @member {number} needUsergrowthTask
             * @memberof tieba.profile.ProfileRequestData
             * @instance
             */
            ProfileRequestData.prototype.needUsergrowthTask = 0;

            // OneOf field names bound to virtual getters and setters
            let $oneOfFields;

            // Virtual OneOf for proto3 optional field
            Object.defineProperty(ProfileRequestData.prototype, "_uid", {
                get: $util.oneOfGetter($oneOfFields = ["uid"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            // Virtual OneOf for proto3 optional field
            Object.defineProperty(ProfileRequestData.prototype, "_friendUid", {
                get: $util.oneOfGetter($oneOfFields = ["friendUid"]),
                set: $util.oneOfSetter($oneOfFields)
            });

            /**
             * Creates a new ProfileRequestData instance using the specified properties.
             * @function create
             * @memberof tieba.profile.ProfileRequestData
             * @static
             * @param {tieba.profile.IProfileRequestData=} [properties] Properties to set
             * @returns {tieba.profile.ProfileRequestData} ProfileRequestData instance
             */
            ProfileRequestData.create = function create(properties) {
                return new ProfileRequestData(properties);
            };

            /**
             * Encodes the specified ProfileRequestData message. Does not implicitly {@link tieba.profile.ProfileRequestData.verify|verify} messages.
             * @function encode
             * @memberof tieba.profile.ProfileRequestData
             * @static
             * @param {tieba.profile.IProfileRequestData} message ProfileRequestData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ProfileRequestData.encode = function encode(message, writer) {
                if (!writer)
                    writer = $Writer.create();
                if (message.uid != null && Object.hasOwnProperty.call(message, "uid"))
                    writer.uint32(/* id 1, wireType 0 =*/8).int64(message.uid);
                if (message.needPostCount != null && Object.hasOwnProperty.call(message, "needPostCount"))
                    writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.needPostCount);
                if (message.friendUid != null && Object.hasOwnProperty.call(message, "friendUid"))
                    writer.uint32(/* id 3, wireType 0 =*/24).int64(message.friendUid);
                if (message.isGuest != null && Object.hasOwnProperty.call(message, "isGuest"))
                    writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.isGuest);
                if (message.stType != null && Object.hasOwnProperty.call(message, "stType"))
                    writer.uint32(/* id 5, wireType 2 =*/42).string(message.stType);
                if (message.pn != null && Object.hasOwnProperty.call(message, "pn"))
                    writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.pn);
                if (message.rn != null && Object.hasOwnProperty.call(message, "rn"))
                    writer.uint32(/* id 7, wireType 0 =*/56).uint32(message.rn);
                if (message.hasPlist != null && Object.hasOwnProperty.call(message, "hasPlist"))
                    writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.hasPlist);
                if (message.common != null && Object.hasOwnProperty.call(message, "common"))
                    $root.tieba.CommonRequest.encode(message.common, writer.uint32(/* id 9, wireType 2 =*/74).fork()).ldelim();
                if (message.scrW != null && Object.hasOwnProperty.call(message, "scrW"))
                    writer.uint32(/* id 10, wireType 0 =*/80).uint32(message.scrW);
                if (message.scrH != null && Object.hasOwnProperty.call(message, "scrH"))
                    writer.uint32(/* id 11, wireType 0 =*/88).uint32(message.scrH);
                if (message.qType != null && Object.hasOwnProperty.call(message, "qType"))
                    writer.uint32(/* id 12, wireType 0 =*/96).uint32(message.qType);
                if (message.scrDip != null && Object.hasOwnProperty.call(message, "scrDip"))
                    writer.uint32(/* id 13, wireType 1 =*/105).double(message.scrDip);
                if (message.isFromUsercenter != null && Object.hasOwnProperty.call(message, "isFromUsercenter"))
                    writer.uint32(/* id 14, wireType 0 =*/112).int32(message.isFromUsercenter);
                if (message.page != null && Object.hasOwnProperty.call(message, "page"))
                    writer.uint32(/* id 15, wireType 0 =*/120).int32(message.page);
                if (message.friendUidPortrait != null && Object.hasOwnProperty.call(message, "friendUidPortrait"))
                    writer.uint32(/* id 16, wireType 2 =*/130).string(message.friendUidPortrait);
                if (message.historyForumIds != null && Object.hasOwnProperty.call(message, "historyForumIds"))
                    writer.uint32(/* id 17, wireType 2 =*/138).string(message.historyForumIds);
                if (message.historyForumNames != null && Object.hasOwnProperty.call(message, "historyForumNames"))
                    writer.uint32(/* id 18, wireType 2 =*/146).string(message.historyForumNames);
                if (message.needUsergrowthTask != null && Object.hasOwnProperty.call(message, "needUsergrowthTask"))
                    writer.uint32(/* id 19, wireType 0 =*/152).int32(message.needUsergrowthTask);
                return writer;
            };

            /**
             * Encodes the specified ProfileRequestData message, length delimited. Does not implicitly {@link tieba.profile.ProfileRequestData.verify|verify} messages.
             * @function encodeDelimited
             * @memberof tieba.profile.ProfileRequestData
             * @static
             * @param {tieba.profile.IProfileRequestData} message ProfileRequestData message or plain object to encode
             * @param {$protobuf.Writer} [writer] Writer to encode to
             * @returns {$protobuf.Writer} Writer
             */
            ProfileRequestData.encodeDelimited = function encodeDelimited(message, writer) {
                return this.encode(message, writer).ldelim();
            };

            /**
             * Decodes a ProfileRequestData message from the specified reader or buffer.
             * @function decode
             * @memberof tieba.profile.ProfileRequestData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @param {number} [length] Message length if known beforehand
             * @returns {tieba.profile.ProfileRequestData} ProfileRequestData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ProfileRequestData.decode = function decode(reader, length) {
                if (!(reader instanceof $Reader))
                    reader = $Reader.create(reader);
                let end = length === undefined ? reader.len : reader.pos + length, message = new $root.tieba.profile.ProfileRequestData();
                while (reader.pos < end) {
                    let tag = reader.uint32();
                    switch (tag >>> 3) {
                    case 1: {
                            message.uid = reader.int64();
                            break;
                        }
                    case 2: {
                            message.needPostCount = reader.uint32();
                            break;
                        }
                    case 3: {
                            message.friendUid = reader.int64();
                            break;
                        }
                    case 4: {
                            message.isGuest = reader.uint32();
                            break;
                        }
                    case 5: {
                            message.stType = reader.string();
                            break;
                        }
                    case 6: {
                            message.pn = reader.uint32();
                            break;
                        }
                    case 7: {
                            message.rn = reader.uint32();
                            break;
                        }
                    case 8: {
                            message.hasPlist = reader.uint32();
                            break;
                        }
                    case 9: {
                            message.common = $root.tieba.CommonRequest.decode(reader, reader.uint32());
                            break;
                        }
                    case 10: {
                            message.scrW = reader.uint32();
                            break;
                        }
                    case 11: {
                            message.scrH = reader.uint32();
                            break;
                        }
                    case 12: {
                            message.qType = reader.uint32();
                            break;
                        }
                    case 13: {
                            message.scrDip = reader.double();
                            break;
                        }
                    case 14: {
                            message.isFromUsercenter = reader.int32();
                            break;
                        }
                    case 15: {
                            message.page = reader.int32();
                            break;
                        }
                    case 16: {
                            message.friendUidPortrait = reader.string();
                            break;
                        }
                    case 17: {
                            message.historyForumIds = reader.string();
                            break;
                        }
                    case 18: {
                            message.historyForumNames = reader.string();
                            break;
                        }
                    case 19: {
                            message.needUsergrowthTask = reader.int32();
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
             * Decodes a ProfileRequestData message from the specified reader or buffer, length delimited.
             * @function decodeDelimited
             * @memberof tieba.profile.ProfileRequestData
             * @static
             * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
             * @returns {tieba.profile.ProfileRequestData} ProfileRequestData
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            ProfileRequestData.decodeDelimited = function decodeDelimited(reader) {
                if (!(reader instanceof $Reader))
                    reader = new $Reader(reader);
                return this.decode(reader, reader.uint32());
            };

            /**
             * Verifies a ProfileRequestData message.
             * @function verify
             * @memberof tieba.profile.ProfileRequestData
             * @static
             * @param {Object.<string,*>} message Plain object to verify
             * @returns {string|null} `null` if valid, otherwise the reason why it is not
             */
            ProfileRequestData.verify = function verify(message) {
                if (typeof message !== "object" || message === null)
                    return "object expected";
                let properties = {};
                if (message.uid != null && message.hasOwnProperty("uid")) {
                    properties._uid = 1;
                    if (!$util.isInteger(message.uid) && !(message.uid && $util.isInteger(message.uid.low) && $util.isInteger(message.uid.high)))
                        return "uid: integer|Long expected";
                }
                if (message.needPostCount != null && message.hasOwnProperty("needPostCount"))
                    if (!$util.isInteger(message.needPostCount))
                        return "needPostCount: integer expected";
                if (message.friendUid != null && message.hasOwnProperty("friendUid")) {
                    properties._friendUid = 1;
                    if (!$util.isInteger(message.friendUid) && !(message.friendUid && $util.isInteger(message.friendUid.low) && $util.isInteger(message.friendUid.high)))
                        return "friendUid: integer|Long expected";
                }
                if (message.isGuest != null && message.hasOwnProperty("isGuest"))
                    if (!$util.isInteger(message.isGuest))
                        return "isGuest: integer expected";
                if (message.stType != null && message.hasOwnProperty("stType"))
                    if (!$util.isString(message.stType))
                        return "stType: string expected";
                if (message.pn != null && message.hasOwnProperty("pn"))
                    if (!$util.isInteger(message.pn))
                        return "pn: integer expected";
                if (message.rn != null && message.hasOwnProperty("rn"))
                    if (!$util.isInteger(message.rn))
                        return "rn: integer expected";
                if (message.hasPlist != null && message.hasOwnProperty("hasPlist"))
                    if (!$util.isInteger(message.hasPlist))
                        return "hasPlist: integer expected";
                if (message.common != null && message.hasOwnProperty("common")) {
                    let error = $root.tieba.CommonRequest.verify(message.common);
                    if (error)
                        return "common." + error;
                }
                if (message.scrW != null && message.hasOwnProperty("scrW"))
                    if (!$util.isInteger(message.scrW))
                        return "scrW: integer expected";
                if (message.scrH != null && message.hasOwnProperty("scrH"))
                    if (!$util.isInteger(message.scrH))
                        return "scrH: integer expected";
                if (message.qType != null && message.hasOwnProperty("qType"))
                    if (!$util.isInteger(message.qType))
                        return "qType: integer expected";
                if (message.scrDip != null && message.hasOwnProperty("scrDip"))
                    if (typeof message.scrDip !== "number")
                        return "scrDip: number expected";
                if (message.isFromUsercenter != null && message.hasOwnProperty("isFromUsercenter"))
                    if (!$util.isInteger(message.isFromUsercenter))
                        return "isFromUsercenter: integer expected";
                if (message.page != null && message.hasOwnProperty("page"))
                    if (!$util.isInteger(message.page))
                        return "page: integer expected";
                if (message.friendUidPortrait != null && message.hasOwnProperty("friendUidPortrait"))
                    if (!$util.isString(message.friendUidPortrait))
                        return "friendUidPortrait: string expected";
                if (message.historyForumIds != null && message.hasOwnProperty("historyForumIds"))
                    if (!$util.isString(message.historyForumIds))
                        return "historyForumIds: string expected";
                if (message.historyForumNames != null && message.hasOwnProperty("historyForumNames"))
                    if (!$util.isString(message.historyForumNames))
                        return "historyForumNames: string expected";
                if (message.needUsergrowthTask != null && message.hasOwnProperty("needUsergrowthTask"))
                    if (!$util.isInteger(message.needUsergrowthTask))
                        return "needUsergrowthTask: integer expected";
                return null;
            };

            /**
             * Creates a ProfileRequestData message from a plain object. Also converts values to their respective internal types.
             * @function fromObject
             * @memberof tieba.profile.ProfileRequestData
             * @static
             * @param {Object.<string,*>} object Plain object
             * @returns {tieba.profile.ProfileRequestData} ProfileRequestData
             */
            ProfileRequestData.fromObject = function fromObject(object) {
                if (object instanceof $root.tieba.profile.ProfileRequestData)
                    return object;
                let message = new $root.tieba.profile.ProfileRequestData();
                if (object.uid != null)
                    if ($util.Long)
                        (message.uid = $util.Long.fromValue(object.uid)).unsigned = false;
                    else if (typeof object.uid === "string")
                        message.uid = parseInt(object.uid, 10);
                    else if (typeof object.uid === "number")
                        message.uid = object.uid;
                    else if (typeof object.uid === "object")
                        message.uid = new $util.LongBits(object.uid.low >>> 0, object.uid.high >>> 0).toNumber();
                if (object.needPostCount != null)
                    message.needPostCount = object.needPostCount >>> 0;
                if (object.friendUid != null)
                    if ($util.Long)
                        (message.friendUid = $util.Long.fromValue(object.friendUid)).unsigned = false;
                    else if (typeof object.friendUid === "string")
                        message.friendUid = parseInt(object.friendUid, 10);
                    else if (typeof object.friendUid === "number")
                        message.friendUid = object.friendUid;
                    else if (typeof object.friendUid === "object")
                        message.friendUid = new $util.LongBits(object.friendUid.low >>> 0, object.friendUid.high >>> 0).toNumber();
                if (object.isGuest != null)
                    message.isGuest = object.isGuest >>> 0;
                if (object.stType != null)
                    message.stType = String(object.stType);
                if (object.pn != null)
                    message.pn = object.pn >>> 0;
                if (object.rn != null)
                    message.rn = object.rn >>> 0;
                if (object.hasPlist != null)
                    message.hasPlist = object.hasPlist >>> 0;
                if (object.common != null) {
                    if (typeof object.common !== "object")
                        throw TypeError(".tieba.profile.ProfileRequestData.common: object expected");
                    message.common = $root.tieba.CommonRequest.fromObject(object.common);
                }
                if (object.scrW != null)
                    message.scrW = object.scrW >>> 0;
                if (object.scrH != null)
                    message.scrH = object.scrH >>> 0;
                if (object.qType != null)
                    message.qType = object.qType >>> 0;
                if (object.scrDip != null)
                    message.scrDip = Number(object.scrDip);
                if (object.isFromUsercenter != null)
                    message.isFromUsercenter = object.isFromUsercenter | 0;
                if (object.page != null)
                    message.page = object.page | 0;
                if (object.friendUidPortrait != null)
                    message.friendUidPortrait = String(object.friendUidPortrait);
                if (object.historyForumIds != null)
                    message.historyForumIds = String(object.historyForumIds);
                if (object.historyForumNames != null)
                    message.historyForumNames = String(object.historyForumNames);
                if (object.needUsergrowthTask != null)
                    message.needUsergrowthTask = object.needUsergrowthTask | 0;
                return message;
            };

            /**
             * Creates a plain object from a ProfileRequestData message. Also converts values to other types if specified.
             * @function toObject
             * @memberof tieba.profile.ProfileRequestData
             * @static
             * @param {tieba.profile.ProfileRequestData} message ProfileRequestData
             * @param {$protobuf.IConversionOptions} [options] Conversion options
             * @returns {Object.<string,*>} Plain object
             */
            ProfileRequestData.toObject = function toObject(message, options) {
                if (!options)
                    options = {};
                let object = {};
                if (options.defaults) {
                    object.needPostCount = 0;
                    object.isGuest = 0;
                    object.stType = "";
                    object.pn = 0;
                    object.rn = 0;
                    object.hasPlist = 0;
                    object.common = null;
                    object.scrW = 0;
                    object.scrH = 0;
                    object.qType = 0;
                    object.scrDip = 0;
                    object.isFromUsercenter = 0;
                    object.page = 0;
                    object.friendUidPortrait = "";
                    object.historyForumIds = "";
                    object.historyForumNames = "";
                    object.needUsergrowthTask = 0;
                }
                if (message.uid != null && message.hasOwnProperty("uid")) {
                    if (typeof message.uid === "number")
                        object.uid = options.longs === String ? String(message.uid) : message.uid;
                    else
                        object.uid = options.longs === String ? $util.Long.prototype.toString.call(message.uid) : options.longs === Number ? new $util.LongBits(message.uid.low >>> 0, message.uid.high >>> 0).toNumber() : message.uid;
                    if (options.oneofs)
                        object._uid = "uid";
                }
                if (message.needPostCount != null && message.hasOwnProperty("needPostCount"))
                    object.needPostCount = message.needPostCount;
                if (message.friendUid != null && message.hasOwnProperty("friendUid")) {
                    if (typeof message.friendUid === "number")
                        object.friendUid = options.longs === String ? String(message.friendUid) : message.friendUid;
                    else
                        object.friendUid = options.longs === String ? $util.Long.prototype.toString.call(message.friendUid) : options.longs === Number ? new $util.LongBits(message.friendUid.low >>> 0, message.friendUid.high >>> 0).toNumber() : message.friendUid;
                    if (options.oneofs)
                        object._friendUid = "friendUid";
                }
                if (message.isGuest != null && message.hasOwnProperty("isGuest"))
                    object.isGuest = message.isGuest;
                if (message.stType != null && message.hasOwnProperty("stType"))
                    object.stType = message.stType;
                if (message.pn != null && message.hasOwnProperty("pn"))
                    object.pn = message.pn;
                if (message.rn != null && message.hasOwnProperty("rn"))
                    object.rn = message.rn;
                if (message.hasPlist != null && message.hasOwnProperty("hasPlist"))
                    object.hasPlist = message.hasPlist;
                if (message.common != null && message.hasOwnProperty("common"))
                    object.common = $root.tieba.CommonRequest.toObject(message.common, options);
                if (message.scrW != null && message.hasOwnProperty("scrW"))
                    object.scrW = message.scrW;
                if (message.scrH != null && message.hasOwnProperty("scrH"))
                    object.scrH = message.scrH;
                if (message.qType != null && message.hasOwnProperty("qType"))
                    object.qType = message.qType;
                if (message.scrDip != null && message.hasOwnProperty("scrDip"))
                    object.scrDip = options.json && !isFinite(message.scrDip) ? String(message.scrDip) : message.scrDip;
                if (message.isFromUsercenter != null && message.hasOwnProperty("isFromUsercenter"))
                    object.isFromUsercenter = message.isFromUsercenter;
                if (message.page != null && message.hasOwnProperty("page"))
                    object.page = message.page;
                if (message.friendUidPortrait != null && message.hasOwnProperty("friendUidPortrait"))
                    object.friendUidPortrait = message.friendUidPortrait;
                if (message.historyForumIds != null && message.hasOwnProperty("historyForumIds"))
                    object.historyForumIds = message.historyForumIds;
                if (message.historyForumNames != null && message.hasOwnProperty("historyForumNames"))
                    object.historyForumNames = message.historyForumNames;
                if (message.needUsergrowthTask != null && message.hasOwnProperty("needUsergrowthTask"))
                    object.needUsergrowthTask = message.needUsergrowthTask;
                return object;
            };

            /**
             * Converts this ProfileRequestData to JSON.
             * @function toJSON
             * @memberof tieba.profile.ProfileRequestData
             * @instance
             * @returns {Object.<string,*>} JSON object
             */
            ProfileRequestData.prototype.toJSON = function toJSON() {
                return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
            };

            /**
             * Gets the default type url for ProfileRequestData
             * @function getTypeUrl
             * @memberof tieba.profile.ProfileRequestData
             * @static
             * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
             * @returns {string} The default type url
             */
            ProfileRequestData.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
                if (typeUrlPrefix === undefined) {
                    typeUrlPrefix = "type.googleapis.com";
                }
                return typeUrlPrefix + "/tieba.profile.ProfileRequestData";
            };

            return ProfileRequestData;
        })();

        return profile;
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
