f = open('expdem20140615.graphml','r')
output = open('output.json','w')
dict = {}
count = 0
output.write("""{"nodes":[""")
edge = False
for line in f.readlines():
    if 'node' in line:# and 'result' not in line and not 'hashtag' in line:
        #<node id='1959028638'><data key='name'>expdem</data></node>
        id = line.split("<node id='")[1].split("'>")[0]
        dict[id] = count
        name_aux = line.split("'name'>")[1].split("<")[0]
        #{"name":"Moe","group":1},
        print name_aux
        aux = """{"name":"%s","group":%s},""" %(name_aux,1)
        print aux
        output.write(aux)
    elif 'edge' in line:# and 'result' not in line and not 'hashtag' in line:
        if not edge:
            print dict
            output.write("""],"links":[""")
            edge = True
        #<edge id='edge22' source='29196433' target='1959028638' />
        #{"source":0,"target":1,"value":100},
        source_aux = line.split("source='")[1].split("' target")[0]
        target_aux = line.split("target='")[1].split("' />")[0]
        aux_edge =  """{"source":%s,"target":%s,"value":1},""" %(dict[source_aux],dict[target_aux])
        output.write(aux_edge)
        print 'EDGE',line
    count += 1
output.write("""] }""")
f.close()
output.close()
