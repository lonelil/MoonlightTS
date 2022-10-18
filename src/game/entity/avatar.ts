import {
  AbilityEmbryo,
  AvatarInfo,
  PropValue,
  SceneWeaponInfo,
  ProtEntityType,
  AbilitySyncStateInfo,
  Vector,
  SceneTeamAvatar,
  AbilityControlBlock,
  SceneEntityInfo,
  MotionInfo,
  EntityAuthorityInfo,
  SceneEntityAiInfo,
  PropPair,
  SceneAvatarInfo,
  AvatarEnterSceneInfo,
} from '../../data/proto/game';
import {
  EntityProperties,
  EntityProperty,
} from '../managers/constants/EntityProperties';
import { FightProperty } from '../managers/constants/FightProperties';
import { World } from '../World';
import { Entity } from './entity';

export class Avatar extends Entity {
  public weaponInfo: SceneWeaponInfo;
  public avatarInfo: AvatarInfo;
  public fightProps: { [key: number]: number } = {};
  public props: { [key: number]: PropValue } = {};
  public embryos: AbilityEmbryo[] = [];
  public world: World;

  constructor(world: World, avatarInfo: AvatarInfo, motion: Vector) {
    super(world, motion, ProtEntityType.PROT_ENTITY_TYPE_AVATAR);
    this.weaponInfo = SceneWeaponInfo.fromPartial({
      entityId: world.getNextEntityId(ProtEntityType.PROT_ENTITY_TYPE_WEAPON),
      guid: world.getNextGuid(),
      itemId: 13509,
      level: 90,
      promoteLevel: 6,
      gadgetId: 50011406,
      abilityInfo: AbilitySyncStateInfo.fromPartial({}),
    });
    this.world = world;
    this.avatarInfo = avatarInfo;
    this.id = world.getNextEntityId(ProtEntityType.PROT_ENTITY_TYPE_AVATAR);
    this.guid = this.avatarInfo.guid;

    this.props = this.avatarInfo.propMap;
    this.fightProps = this.avatarInfo.fightPropMap;

    let embryoId = 1;

    const defaults = [
      0x05ff9657, 0x0797d262, 0x0c7599f3, 0x1daa7b46, 0x1ee50216, 0x279c736a,
      0x31306655, 0x3404dea1, 0x35a975db, 0x36bce44f, 0x3e8b0dc0, 0x43732fb4,
      0x441d271f, 0x540e3e8e, 0x57e91c26, 0x5d3eea62, 0x5e10f925, 0x74bf7a58,
      0x8973b6b7, 0x9e17fc49, 0xb4bd9d18, 0xb5f36bfe, 0xb91c23f9, 0xbc3037e5,
      0xc34fdbd9, 0xc3b1a5bb, 0xc92024f2, 0xcc650f14, 0xcc650f15, 0xd6820468,
      0xe0ccee0d, 0xe46a6608, 0xf338f895, 0xf56f5546, 0xf8b2753e, 0xfd8e4031,
      0xffc8eab3,
    ];

    defaults.forEach((val) => {
      this.embryos.push(
        AbilityEmbryo.fromPartial({
          abilityId: ++embryoId,
          abilityNameHash: val,
        })
      );
    });
  }

  getSceneTeamAvatar(isPlayerCurAvatar = true): SceneTeamAvatar {
    return SceneTeamAvatar.fromPartial({
      sceneId: this.world.getSceneId(),
      playerUid: this.world.session.uid,
      avatarGuid: this.guid,
      entityId: this.id,
      weaponGuid: 2785642601942876162,
      weaponEntityId: 100664575,
      isPlayerCurAvatar: isPlayerCurAvatar,
      sceneEntityInfo: this.getSceneEntityInfo(),
      abilityControlBlock: AbilityControlBlock.fromPartial({
        abilityEmbryoList: this.embryos,
      }),
    });
  }

  getSceneEntityInfo(): SceneEntityInfo {
    return SceneEntityInfo.fromPartial({
      entityId: this.id,
      lifeState: 1,
      motionInfo: MotionInfo.fromPartial({
        pos: this.motion,
        rot: this.rotation,
        speed: this.speed,
      }),
      entityAuthorityInfo: EntityAuthorityInfo.fromPartial({
        aiInfo: SceneEntityAiInfo.fromPartial({ isAiOpen: true }),
      }),
      entityType: ProtEntityType.PROT_ENTITY_TYPE_AVATAR,
      propList: EntityProperty.getEntityPropPair(),
      fightPropList: FightProperty.getPropertiesPair(),
      avatar: this.getSceneAvatarInfo(),
    });
  }

  getSceneAvatarInfo(): SceneAvatarInfo {
    return SceneAvatarInfo.fromPartial({
      uid: this.world.session.uid,
      guid: this.guid,
      wearingFlycloakId: 140001,
      inherentProudSkillList: this.avatarInfo.inherentProudSkillList,
      proudSkillExtraLevelMap: this.avatarInfo.proudSkillExtraLevelMap,
      skillLevelMap: this.avatarInfo.skillLevelMap,
      talentIdList: this.avatarInfo.talentIdList,
      coreProudSkillLevel: this.avatarInfo.coreProudSkillLevel,
      bornTime: Date.now() / 1000,
      skillDepotId: this.avatarInfo.skillDepotId,
      avatarId: this.avatarInfo.avatarId,
      peerId: 1,
      equipIdList: [11406],
      weapon: this.weaponInfo,
      teamResonanceList: this.avatarInfo.teamResonanceList,
    });
  }

  getAvatarEnterSceneInfo(): AvatarEnterSceneInfo {
    return AvatarEnterSceneInfo.fromPartial({
      avatarGuid: this.guid,
      avatarEntityId: this.id,
      weaponEntityId: this.weaponInfo.entityId,
      weaponGuid: this.weaponInfo.guid,
    });
  }

  getAvatarPropPair(prop: number): PropPair {
    return PropPair.fromPartial({ type: prop, propValue: this.props[prop] });
  }
}

export class InherentProudSkillOpen {
  public proudSkillGroupId;
  public needAvatarPromoteLevel;
  public static proudSkillExtraMap: { [key: number]: number } = [];

  constructor(proudSkillGroupId: number, needAvatarPromoteLevel: number) {
    this.proudSkillGroupId = proudSkillGroupId;
    this.needAvatarPromoteLevel = needAvatarPromoteLevel;
  }
}

export class AvatarDepot {
  public skillMap: number[];
  public subSkillMap: number[];
  public talentIds: number[];
  public inherentProudSkillOpens: InherentProudSkillOpen[];

  constructor(
    skillMap: number[],
    subSkillMap: number[],
    talentIds: number[],
    inherentProudSkillOpens: InherentProudSkillOpen[]
  ) {
    this.inherentProudSkillOpens = inherentProudSkillOpens;
    this.skillMap = skillMap;
    this.subSkillMap = subSkillMap;
    this.talentIds = talentIds;
  }

  getDefaultSkillMap() {
    const skills: { [key: number]: number } = [];
    this.skillMap.forEach((e) => {
      skills[e] = 1;
    });
    // this.subSkillMap.forEach((e) => {
    //   skills[e] = 1;
    // });
    return skills;
  }

  getDefaultProudSkillsMap() {
    const map: { [key: number]: number } = [];
    // this.inherentProudSkillOpens.forEach((e) => {
    //   map[e.proudSkillGroupId] = 3;
    // });

    // for(let skill of this.inherentProudSkillOpens){
    //   if(InherentProudSkillOpen.proudSkillExtraMap[skill.proudSkillGroupId] === undefined){
    //     continue
    //   }else{
    //     map[InherentProudSkillOpen.proudSkillExtraMap[skill.proudSkillGroupId]] = 3
    //   }
    // }

    this.skillMap.forEach((e) => {
      map[InherentProudSkillOpen.proudSkillExtraMap[e]] = 3;
    });

    return map;
  }
}