const G = 6.67430e-11;
var timestep = 100;
var tick = 0;

var objhistory = [];

var objects = {
	kerbol: {
		mass: 1.7565459e28, // kg
		x: 0, // m
		y: 0, // m
		z: 0, // m
		vx: 0, // m/s
		vy: 0, // m/s
		vz: 0, // m/s
		orbits: null,
		color: "#000000"
	},
	moho: {
		mass: 2.5263314e21,
		x: -561904829.2390558,
		y: -6287565271.1039095,
		z: -199212566.40062177,
		vx: 12055.741042699212,
		vy: -1031.9485058951839,
		vz: -1434.3248012752226,
		orbits: "kerbol",
		color: "#964b00"
	},
	eve: {
		mass: 1.224398e23, // e23
		x: -9592620382.23099,
		y: -2570334884.717086,
		z: 0,
		vx: 2795.7869717833714,
		vy: -10434.01902583577,
		vz: -396.0947090126121,
		orbits: "kerbol",
		color: "#ae2bb5"
	},
        gilly: {
            mass: 1.2420363e17,
            x: -25598978.293388262 - 9592620382.23099,
            y: -13483522.012240263 - 2570334884.717086,
            z: 4860888.685061289,
            vx: -57.797389152373256 + 2795.7869717833714,
            vy: -542.3820475708756 - 10434.01902583577,
            vz: -7.920779392144766 - 396.094709012612,
            orbits: "eve",
            color: "#964b00"
        },
    kerbin: {
        mass: 5.2915158e22,
        x: -13599840256,
        y: 0,
        z: 0,
        vx: 0,
        vy: -9283.484116325251,
        vz: 0,
        orbits: "kerbol",
        color: "#427ef5"
    },

    duna: {
        mass: 4.515427e21,
        x: 15536869468.40287,
        y: -15268039103.985397,
        z: 0.00000007003750892760691,
        vx: 5008.541086142546,
        vy: 5096.728437263236,
        vz: -7.483042591758637,
        orbits: "kerbol",
        color: "#ed4a13"
    },

    

}

function distance(x1,y1,z1,x2,y2,z2) {
	var x = x2-x1;
	var y = y2-y1;
	var z = z2-z1;
	return Math.sqrt(Math.pow(x,2)+Math.pow(y,2)+Math.pow(z,2));
}

function crossproduct(x1,y1,z1,x2,y2,z2) {
	var x,y,z;
	x = y1*z2 - z1*y2;
	y = z1*x2 - x1*z2;
	z = x1*y2 - y1*x2;
	return [x,y,z];
}

function gravParam(obj) {
	var a = objects[obj];
	return G*a.mass;
}

function magnitude(vector) {
	return Math.sqrt(Math.pow(vector[0],2)+Math.pow(vector[1],2)+Math.pow(vector[2],2));
}

function normalize(vector) {
	var d = magnitude(vector);
	return [vector[0]/d, vector[1]/d, vector[2]/d];
}

function cart2kepler(obj) {
	var a = objects[obj];
	var r = [a.x,a.y,a.z];
	var R = [a.vx,a.vy,a.vz];
	var h = crossproduct(a.x,a.y,a.z,a.vx,a.vy,a.vz);

    var mu = gravParam(a.orbits);

    var e0 = [
        (1/mu) * ((Math.pow(magnitude(R),2) - (mu/magnitude(r))) * a.x - (((a.x*a.vx)+(a.y*a.vy)+(a.z*a.vz)) * a.vx)),
        (1/mu) * ((Math.pow(magnitude(R),2) - (mu/magnitude(r))) * a.y - (((a.x*a.vx)+(a.y*a.vy)+(a.z*a.vz)) * a.vy)),
        (1/mu) * ((Math.pow(magnitude(R),2) - (mu/magnitude(r))) * a.z - (((a.x*a.vx)+(a.y*a.vy)+(a.z*a.vz)) * a.vz))
    ];
    
    var e = magnitude(e0);

    var A = -mu/(2* ( Math.pow(magnitude(R),2) / 2  - mu/magnitude(r)));

    var i = Math.acos(h[2]/magnitude(h)) * 180/Math.PI;

    

	return [h,e,A,i];
}

function nbody() {	
	var dvx = 0;
	var dvy = 0;
	var dvz = 0;
	var a,b;
	var vector, unitvector = [];
	var orbitchecker = [];
	var orbitchecker2 = [];

    var orbit1, orbit2;
	
	for (i in objects) {
		dvx, dvy, dvz = 0;
		for (j in objects) {
			if (i != j) {
				a = objects[i];
				b = objects[j];

                orbit1 = objects[a.orbits];
                orbit2 = objects[b.orbits];

				
				// G m1 m2 (x1-x2) / d^3
				// m^3 kg^-1 s^-2 kg kg m / m^3 = m s^-2 kg
				
				// G * m2(x2-x1)/d^3
				
				d = distance(a.x,a.y,a.z,b.x,b.y,b.z);
				
				vector = [a.x-b.x,a.y-b.y,a.z-b.z];
				unitvector = [vector[0]/d, vector[1]/d, vector[2]/d];
				
				dvx += G * b.mass/Math.pow(d,3) * (b.x-a.x) * timestep;
				dvy += G * b.mass/Math.pow(d,3) * (b.y-a.y) * timestep;
				dvz += G * b.mass/Math.pow(d,3) * (b.z-a.z) * timestep;
				
				a.vx+=dvx;
				a.vy+=dvy;
				a.vz+=dvz;

				orbitchecker.push([j, magnitude([G * b.mass/Math.pow(d,3) * (b.x-a.x) * timestep,G * b.mass/Math.pow(d,3) * (b.y-a.y) * timestep,G * b.mass/Math.pow(d,3) * (b.z-a.z) * timestep])]);
				
				a.x+=a.vx * timestep;
				a.y+=a.vy * timestep;
				a.z+=a.vz * timestep;


			}
		}
        for (k in orbitchecker) {
            orbitchecker2.push(orbitchecker[k][1]);
        }

        if (a.orbits != null) {
            a.orbits = orbitchecker[orbitchecker2.indexOf(Math.max(...orbitchecker2))][0];
        }


        orbitchecker = [];
        orbitchecker2 = [];


        dvx = 0;
        dvy = 0;
        dvz = 0;
	}
    
    objhistory.push(objects);
    if (objhistory.length > 100) {
        objhistory.splice(0,1);
    }

	tick += timestep;
}
