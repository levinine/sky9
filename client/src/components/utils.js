export const getColumnWidth = (rows, accessor, headerText) => {
  console.log('in get column width');
  const maxWidth = 400
  const magicSpacing = 10
  const cellLength = Math.max(
    ...rows.map(row => (`${row[accessor]}` || '').length),
    headerText.length,
  )
  return Math.min(maxWidth, cellLength * magicSpacing)
}

export const awsMocksAccounts = [
  {
      "forecastedSpend": "0.035",
      "budget": "50",
      "awsAccountId": "804224475044",
      "ownerFirstName": "Damir",
      "ownerLastName": "Solajic",
      "email": "AWS-SRB-ITOperations2@levi9.com",
      "name": "AWS-SRB-ITOperations2",
      "history": [
          {
              "type": "DynamoDB created",
              "timestamp": 1585922787440,
              "record": {
                  "account": {
                      "owner": "d.solajic@levi9.com",
                      "ownerLastName": "Solajic",
                      "name": "AWS-SRB-ITOperations2",
                      "ownerFirstName": "Damir",
                      "id": "1585922787354",
                      "email": "AWS-SRB-ITOperations2@levi9.com",
                      "budget": "50"
                  }
              }
          },
          {
              "type": "AD Group creation requested",
              "timestamp": 1585922788995,
              "record": {}
          },
          {
              "type": "AD Group creation verified",
              "timestamp": 1585922820514,
              "record": {}
          },
          {
              "type": "AWS account creation requested",
              "timestamp": 1585922824238,
              "record": {}
          },
          {
              "type": "AWS account creation validated",
              "timestamp": 1585924267814,
              "record": {
                  "organizationAccount": {
                      "Status": "ACTIVE",
                      "JoinedMethod": "CREATED",
                      "JoinedTimestamp": {},
                      "Email": "AWS-SRB-ITOperations2@levi9.com",
                      "Id": "804224475044",
                      "Arn": "arn:aws:organizations::655205861117:account/o-okktyetnkh/804224475044",
                      "Name": "AWS-SRB-ITOperations2"
                  },
                  "provisionedAccount": {
                      "Status": "AVAILABLE",
                      "IdempotencyToken": "6404d944-0e24-48d1-8ea3-6969c8cf2b6f",
                      "Type": "CONTROL_TOWER_ACCOUNT",
                      "CreatedTime": {},
                      "LastRecordId": "rec-iwsv6aymy3kje",
                      "ProductId": "prod-ljlugn43bbzii",
                      "Id": "pp-pyihcszeq5sjs",
                      "Arn": "arn:aws:servicecatalog:eu-west-1:655205861117:stack/AWS-SRB-ITOperations2/pp-pyihcszeq5sjs",
                      "Name": "AWS-SRB-ITOperations2",
                      "ProvisioningArtifactId": "pa-rsjaqeqbhhums"
                  },
                  "account": {
                      "owner": "d.solajic@levi9.com",
                      "ownerLastName": "Solajic",
                      "awsAccountId": "804224475044",
                      "members": [
                          "d.solajic@levi9.com"
                      ],
                      "name": "AWS-SRB-ITOperations2",
                      "ownerFirstName": "Damir",
                      "id": "1585922787354",
                      "email": "AWS-SRB-ITOperations2@levi9.com",
                      "budget": "50"
                  }
              }
          },
          {
              "type": "AWS budget created",
              "timestamp": 1585924269746,
              "record": {
                  "budget": {}
              }
          }
      ],
      "actualSpend": "0.013",
      "members": [
          "d.solajic@levi9.com"
      ],
      "owner": "d.solajic@levi9.com",
      "id": "1585922787354"
  },
  {
      "forecastedSpend": "0.078",
      "budget": "50",
      "awsAccountId": "724476785351",
      "ownerFirstName": "Filip",
      "ownerLastName": "Stanisic",
      "email": "AWS-SRB-Incision-Medical@levi9.com",
      "name": "AWS-SRB-Incision-Medical",
      "history": [
          {
              "type": "DynamoDB created",
              "timestamp": 1663852688756,
              "record": {
                  "account": {
                      "owner": "f.stanisic@levi9.com",
                      "ownerLastName": "Stanisic",
                      "name": "AWS-SRB-Incision-Medical",
                      "ownerFirstName": "Filip",
                      "id": "1663852688656",
                      "email": "AWS-SRB-Incision-Medical@levi9.com",
                      "budget": "50"
                  }
              }
          },
          {
              "type": "AD Group creation requested",
              "timestamp": 1663852689959,
              "record": {}
          },
          {
              "type": "AD Group creation verified",
              "timestamp": 1663852722127,
              "record": {}
          },
          {
              "type": "AWS account creation requested",
              "timestamp": 1663852724895,
              "record": {}
          },
          {
              "type": "AWS account creation validated",
              "timestamp": 1663853627843,
              "record": {
                  "organizationAccount": {
                      "Status": "ACTIVE",
                      "JoinedMethod": "CREATED",
                      "JoinedTimestamp": {},
                      "Email": "AWS-SRB-Incision-Medical@levi9.com",
                      "Id": "724476785351",
                      "Arn": "arn:aws:organizations::655205861117:account/o-okktyetnkh/724476785351",
                      "Name": "AWS-SRB-Incision-Medical"
                  },
                  "provisionedAccount": {
                      "Status": "AVAILABLE",
                      "IdempotencyToken": "24ab6645-81f5-4f4f-b5b6-6ed7da30e48a",
                      "Type": "CONTROL_TOWER_ACCOUNT",
                      "LastSuccessfulProvisioningRecordId": "rec-fgnn4giau65i6",
                      "CreatedTime": {},
                      "LastRecordId": "rec-fgnn4giau65i6",
                      "ProductId": "prod-ljlugn43bbzii",
                      "Id": "pp-cf6icwdnl2sfs",
                      "Arn": "arn:aws:servicecatalog:eu-west-1:655205861117:stack/AWS-SRB-Incision-Medical/pp-cf6icwdnl2sfs",
                      "Name": "AWS-SRB-Incision-Medical",
                      "LastProvisioningRecordId": "rec-fgnn4giau65i6",
                      "ProvisioningArtifactId": "pa-rsjaqeqbhhums"
                  },
                  "account": {
                      "owner": "f.stanisic@levi9.com",
                      "ownerLastName": "Stanisic",
                      "awsAccountId": "724476785351",
                      "members": [
                          "f.stanisic@levi9.com"
                      ],
                      "name": "AWS-SRB-Incision-Medical",
                      "ownerFirstName": "Filip",
                      "id": "1663852688656",
                      "email": "AWS-SRB-Incision-Medical@levi9.com",
                      "budget": "50"
                  }
              }
          },
          {
              "type": "AWS budget created",
              "timestamp": 1663853629549,
              "record": {
                  "budget": {}
              }
          }
      ],
      "actualSpend": "0.015",
      "members": [
          "f.stanisic@levi9.com",
          "m.djakovic@levi9.com",
          "m.zorboski@levi9.com",
          "p.simic@levi9.com",
          "d.bezanovic@levi9.com",
          "nadja.zorboski@levi9.com",
          "marija.zaric@levi9.com",
          "uros.mladenovic@levi9.com"
      ],
      "owner": "f.stanisic@levi9.com",
      "id": "1663852688656"
  }
];

export const gcpMockAccounts = [
  {
    "forecastedSpend": "37.665",
    "budget": "100",
    "awsAccountId": "742649604066",
    "ownerFirstName": "Petar",
    "ownerLastName": "Damjanovic",
    "email": "AWS-SRB-DU01-DataTeam@levi9.com",
    "name": "AWS-SRB-DU01-DataTeam",
    "history": [
        {
            "type": "DynamoDB created",
            "timestamp": 1640127410415,
            "record": {
                "account": {
                    "owner": "k.stojakovic@levi9.com",
                    "ownerLastName": "Stojakovic",
                    "name": "AWS-SRB-DU01-DataTeam",
                    "ownerFirstName": "Kosta",
                    "id": "1640127410336",
                    "email": "AWS-SRB-DU01-DataTeam@levi9.com",
                    "budget": "50"
                }
            }
        },
        {
            "type": "AD Group creation requested",
            "timestamp": 1640127411542,
            "record": {}
        },
        {
            "type": "AD Group creation verified",
            "timestamp": 1640127443133,
            "record": {}
        },
        {
            "type": "AWS account creation requested",
            "timestamp": 1640127446287,
            "record": {}
        },
        {
            "type": "AWS account creation validated",
            "timestamp": 1640128168706,
            "record": {
                "organizationAccount": {
                    "Status": "ACTIVE",
                    "JoinedMethod": "CREATED",
                    "JoinedTimestamp": {},
                    "Email": "AWS-SRB-DU01-DataTeam@levi9.com",
                    "Id": "742649604066",
                    "Arn": "arn:aws:organizations::655205861117:account/o-okktyetnkh/742649604066",
                    "Name": "AWS-SRB-DU01-DataTeam"
                },
                "provisionedAccount": {
                    "Status": "AVAILABLE",
                    "IdempotencyToken": "f55bbf25-d5a2-4aaf-a758-bc2be5da2783",
                    "Type": "CONTROL_TOWER_ACCOUNT",
                    "LastSuccessfulProvisioningRecordId": "rec-ws4mbyyegtz6i",
                    "CreatedTime": {},
                    "LastRecordId": "rec-ws4mbyyegtz6i",
                    "ProductId": "prod-ljlugn43bbzii",
                    "Id": "pp-g5quv5oauk6z6",
                    "Arn": "arn:aws:servicecatalog:eu-west-1:655205861117:stack/AWS-SRB-DU01-DataTeam/pp-g5quv5oauk6z6",
                    "Name": "AWS-SRB-DU01-DataTeam",
                    "LastProvisioningRecordId": "rec-ws4mbyyegtz6i",
                    "ProvisioningArtifactId": "pa-rsjaqeqbhhums"
                },
                "account": {
                    "owner": "k.stojakovic@levi9.com",
                    "ownerLastName": "Stojakovic",
                    "awsAccountId": "742649604066",
                    "name": "AWS-SRB-DU01-DataTeam",
                    "ownerFirstName": "Kosta",
                    "id": "1640127410336",
                    "email": "AWS-SRB-DU01-DataTeam@levi9.com",
                    "budget": "50"
                }
            }
        },
        {
            "type": "AWS budget created",
            "timestamp": 1640128170390,
            "record": {
                "budget": {}
            }
        }
    ],
    "actualSpend": "21.866",
    "members": [
        "n.milutinovic@levi9.com",
        "a.bircakovic@levi9.com",
        "z.miladinovic@levi9.com",
        "m.suker@levi9.com",
        "p.damjanovic@levi9.com",
        "k.stojakovic@levi9.com",
        "m.kuljic@levi9.com",
        "d.gozdenovic@levi9.com",
        "m.slijepcevic@levi9.com",
        "d.jazvin@levi9.com",
        "m.dobric@levi9.com",
        "z.leto@levi9.com",
        "stevan.momcilovic@levi9.com",
        "srdjan.vidic@levi9.com",
        "ivana.perovic@levi9.com"
    ],
    "owner": "p.damjanovic@levi9.com",
    "id": "1640127410336"
  },
  {
    "forecastedSpend": "12.031",
    "budget": "50",
    "awsAccountId": "802288441694",
    "ownerFirstName": "Lazar",
    "ownerLastName": "Veljovic",
    "email": "AWS-SRB-DU01-ITOps@levi9.com",
    "name": "AWS-SRB-DU01-ITOps",
    "history": [
        {
            "type": "DynamoDB created",
            "timestamp": 1585754801794,
            "record": {
                "account": {
                    "owner": "n.djordjevic@levi9.com",
                    "ownerLastName": "Đorđević",
                    "name": "AWS-SRB-DU01-ITOps",
                    "ownerFirstName": "Nikola",
                    "id": "1585754801772",
                    "email": "AWS-SRB-DU01-ITOps@levi9.com",
                    "budget": "50"
                }
            }
        },
        {
            "type": "AD Group creation requested",
            "timestamp": 1585754802547,
            "record": {}
        },
        {
            "type": "AD Group creation verified",
            "timestamp": 1585754823215,
            "record": {}
        },
        {
            "type": "AWS account creation requested",
            "timestamp": 1585754826870,
            "record": {}
        },
        {
            "type": "AWS account creation validated",
            "timestamp": 1585756089773,
            "record": {
                "organizationAccount": {
                    "Status": "ACTIVE",
                    "JoinedMethod": "CREATED",
                    "JoinedTimestamp": {},
                    "Email": "AWS-SRB-DU01-ITOps@levi9.com",
                    "Id": "802288441694",
                    "Arn": "arn:aws:organizations::655205861117:account/o-okktyetnkh/802288441694",
                    "Name": "AWS-SRB-DU01-ITOps"
                },
                "provisionedAccount": {
                    "Status": "AVAILABLE",
                    "IdempotencyToken": "7eab5536-a0d3-4869-a8c8-ccde5c86674c",
                    "Type": "CONTROL_TOWER_ACCOUNT",
                    "CreatedTime": {},
                    "LastRecordId": "rec-dsucv52bzbaxw",
                    "ProductId": "prod-ljlugn43bbzii",
                    "Id": "pp-y65shyzd3px4c",
                    "Arn": "arn:aws:servicecatalog:eu-west-1:655205861117:stack/AWS-SRB-DU01-ITOps/pp-y65shyzd3px4c",
                    "Name": "AWS-SRB-DU01-ITOps",
                    "ProvisioningArtifactId": "pa-rsjaqeqbhhums"
                },
                "account": {
                    "owner": "n.djordjevic@levi9.com",
                    "ownerLastName": "Đorđević",
                    "awsAccountId": "802288441694",
                    "members": [
                        "n.djordjevic@levi9.com"
                    ],
                    "name": "AWS-SRB-DU01-ITOps",
                    "ownerFirstName": "Nikola",
                    "id": "1585754801772",
                    "email": "AWS-SRB-DU01-ITOps@levi9.com",
                    "budget": "50"
                }
            }
        },
        {
            "type": "AWS budget created",
            "timestamp": 1585756091785,
            "record": {
                "budget": {}
            }
        }
    ],
    "actualSpend": "9.878",
    "members": [
        "l.veljovic@levi9.com",
        "d.martinovski@levi9.com",
        "m.grozdanovic@levi9.com",
        "d.opalic@levi9.com",
        "milica.pajic@levi9.com",
        "nikola.gospodjinacki@levi9.com",
        "marko.mandic@levi9.com"
    ],
    "owner": "l.veljovic@levi9.com",
    "id": "1585754801772"
  },
  {
    "forecastedSpend": "0.03",
    "budget": "100",
    "awsAccountId": "498591156518",
    "ownerFirstName": "Dragana",
    "ownerLastName": "Momcilovic",
    "email": "AWS-SRB-DU01-Testing2@levi9.com",
    "name": "AWS-SRB-DU01-Testing2",
    "history": [
        {
            "type": "DynamoDB created",
            "timestamp": 1660894352353,
            "record": {
                "account": {
                    "owner": "d.momcilovic@levi9.com",
                    "ownerLastName": "Momcilovic",
                    "name": "AWS-SRB-DU01-Testing2",
                    "ownerFirstName": "Dragana",
                    "id": "1660894352275",
                    "email": "AWS-SRB-DU01-Testing2@levi9.com",
                    "budget": "100"
                }
            }
        },
        {
            "type": "AD Group creation requested",
            "timestamp": 1660894353585,
            "record": {}
        },
        {
            "type": "AD Group creation verified",
            "timestamp": 1660894395396,
            "record": {}
        },
        {
            "type": "AWS account creation requested",
            "timestamp": 1660894398424,
            "record": {}
        },
        {
            "type": "AWS account creation validated",
            "timestamp": 1660895301242,
            "record": {
                "organizationAccount": {
                    "Status": "ACTIVE",
                    "JoinedMethod": "CREATED",
                    "JoinedTimestamp": {},
                    "Email": "AWS-SRB-DU01-Testing2@levi9.com",
                    "Id": "498591156518",
                    "Arn": "arn:aws:organizations::655205861117:account/o-okktyetnkh/498591156518",
                    "Name": "AWS-SRB-DU01-Testing2"
                },
                "provisionedAccount": {
                    "Status": "AVAILABLE",
                    "IdempotencyToken": "f6a17326-a8cb-439e-a34f-9b00fde30da3",
                    "Type": "CONTROL_TOWER_ACCOUNT",
                    "LastSuccessfulProvisioningRecordId": "rec-v6ngt3z72wwac",
                    "CreatedTime": {},
                    "LastRecordId": "rec-v6ngt3z72wwac",
                    "ProductId": "prod-ljlugn43bbzii",
                    "Id": "pp-hnuppsfe6y7hs",
                    "Arn": "arn:aws:servicecatalog:eu-west-1:655205861117:stack/AWS-SRB-DU01-Testing2/pp-hnuppsfe6y7hs",
                    "Name": "AWS-SRB-DU01-Testing2",
                    "LastProvisioningRecordId": "rec-v6ngt3z72wwac",
                    "ProvisioningArtifactId": "pa-rsjaqeqbhhums"
                },
                "account": {
                    "owner": "d.momcilovic@levi9.com",
                    "ownerLastName": "Momcilovic",
                    "awsAccountId": "498591156518",
                    "name": "AWS-SRB-DU01-Testing2",
                    "ownerFirstName": "Dragana",
                    "id": "1660894352275",
                    "email": "AWS-SRB-DU01-Testing2@levi9.com",
                    "budget": "100"
                }
            }
        },
        {
            "type": "AWS budget created",
            "timestamp": 1660895302941,
            "record": {
                "budget": {}
            }
        }
    ],
    "actualSpend": "0.01",
    "members": [
        "d.momcilovic@levi9.com",
        "v.veselinoviczaric@levi9.com",
        "d.cukdumanjic@levi9.com",
        "t.cucic@levi9.com",
        "m.slijepcevic@levi9.com",
        "j.novakovic@levi9.com"
    ],
    "owner": "d.momcilovic@levi9.com",
    "id": "1660894352275"
  },
  {
    "forecastedSpend": "0.03",
    "budget": "50",
    "awsAccountId": "923917572295",
    "ownerFirstName": "Sanja",
    "ownerLastName": "Sic Misic",
    "email": "AWS-SRB-DU01-Java2-2@levi9.com",
    "name": "AWS-SRB-DU01-Java2-2",
    "history": [
        {
            "type": "DynamoDB created",
            "timestamp": 1645799608363,
            "record": {
                "account": {
                    "owner": "s.sicmisic@levi9.com",
                    "ownerLastName": "Sic Misic",
                    "name": "AWS-SRB-DU01-Java2-2",
                    "ownerFirstName": "Sanja",
                    "id": "1645799608279",
                    "email": "AWS-SRB-DU01-Java2-2@levi9.com",
                    "budget": "50"
                }
            }
        },
        {
            "type": "AD Group creation requested",
            "timestamp": 1645799609657,
            "record": {}
        },
        {
            "type": "AD Group creation verified",
            "timestamp": 1645799641785,
            "record": {}
        },
        {
            "type": "AWS account creation requested",
            "timestamp": 1645799645421,
            "record": {}
        },
        {
            "type": "AWS account creation validated",
            "timestamp": 1645800548174,
            "record": {
                "organizationAccount": {
                    "Status": "ACTIVE",
                    "JoinedMethod": "CREATED",
                    "JoinedTimestamp": {},
                    "Email": "AWS-SRB-DU01-Java2-2@levi9.com",
                    "Id": "923917572295",
                    "Arn": "arn:aws:organizations::655205861117:account/o-okktyetnkh/923917572295",
                    "Name": "AWS-SRB-DU01-Java2-2"
                },
                "provisionedAccount": {
                    "Status": "AVAILABLE",
                    "IdempotencyToken": "4568334f-f499-4013-b830-4baafb5b24b4",
                    "Type": "CONTROL_TOWER_ACCOUNT",
                    "LastSuccessfulProvisioningRecordId": "rec-7w2zgrnzl2jgq",
                    "CreatedTime": {},
                    "LastRecordId": "rec-7w2zgrnzl2jgq",
                    "ProductId": "prod-ljlugn43bbzii",
                    "Id": "pp-y6ab6seh3eg74",
                    "Arn": "arn:aws:servicecatalog:eu-west-1:655205861117:stack/AWS-SRB-DU01-Java2-2/pp-y6ab6seh3eg74",
                    "Name": "AWS-SRB-DU01-Java2-2",
                    "LastProvisioningRecordId": "rec-7w2zgrnzl2jgq",
                    "ProvisioningArtifactId": "pa-rsjaqeqbhhums"
                },
                "account": {
                    "owner": "s.sicmisic@levi9.com",
                    "ownerLastName": "Sic Misic",
                    "awsAccountId": "923917572295",
                    "members": [
                        "s.sicmisic@levi9.com"
                    ],
                    "name": "AWS-SRB-DU01-Java2-2",
                    "ownerFirstName": "Sanja",
                    "id": "1645799608279",
                    "email": "AWS-SRB-DU01-Java2-2@levi9.com",
                    "budget": "50"
                }
            }
        },
        {
            "type": "AWS budget created",
            "timestamp": 1645800549954,
            "record": {
                "budget": {}
            }
        }
    ],
    "actualSpend": "0.01",
    "members": [
        "s.sicmisic@levi9.com",
        "m.dapra@levi9.com",
        "v.skiljevic@levi9.com",
        "m.milosev@levi9.com",
        "ne.jokic@levi9.com",
        "m.marinkovic@levi9.com",
        "i.kujacic@levi9.com",
        "mi.radovic@levi9.com"
    ],
    "owner": "s.sicmisic@levi9.com",
    "id": "1645799608279"
  }
];