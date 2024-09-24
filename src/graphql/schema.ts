import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Rank {
    id: Int!
    name: String!
    color: String!
    group: String!
    visual: String!
    is_bold: Boolean!
    color_code: String!
    players: [Player!]!
  }

  type Version {
    id: Int!
    protocol: Int!
    players: [Player!]!
  }

  type Activity {
    id: Int!
    online: Boolean!
    last_join: String!
    first_join: String!
    current_server: String!
    last_join_formatted: String!
    first_join_formatted: String!
    player: Player
  }

  type Player {
    id: Int!
    exp: Int!
    points: Int!
    uuid: String!
    guild: String!
    level: Int!
    ranks: [Rank!]!
    version: Version
    activity: Activity
    username: String!
    uuid_array: [Int!]!
    simple_uuid: String!
  }

  type Query {
    players: [Player!]!
    player(id: Int, username: String, uuid: String): Player
    ranks: [Rank!]!
    rank(id: Int!): Rank
    versions: [Version!]!
    version(id: Int!): Version
    activities: [Activity!]!
    activity(id: Int!): Activity
  }
`;
